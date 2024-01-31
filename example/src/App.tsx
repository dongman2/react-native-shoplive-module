import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WebView from 'react-native-webview';
import type {EventData} from '../../src/EventEmitter';
import ShopliveJSModule from '../../src/ShopliveJSModule';
import 'react-native-gesture-handler';

import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const shoplive = new ShopliveJSModule();

type RootStackParamList = {
  Home: undefined;
  Webview: {ak: string};
};
const RootStack = createStackNavigator<RootStackParamList>();
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type WebviewProps = NativeStackScreenProps<RootStackParamList, 'Webview'>;

  const playShoplive = (accessKey: string, campaignKey: string) => {
    shoplive.setAccessKey(accessKey);
    shoplive.play(campaignKey);
  }


function HomeScreen({navigation}: HomeProps) {
  const [accessKey, setAccessKey] = useState('');
  const [campaignKey, setCampaignKey] = useState('');

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.headerText}>SAMPLE HOME</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>accessKey:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setAccessKey}
            // placeholder="input accessKey here(*required)"
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>campaignKey:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setCampaignKey}
            // placeholder="input campaignKey here(not required for webview)"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.contentText}>Hello Shoplive</Text>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => playShoplive(accessKey, campaignKey)}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.defaultButton}
            onPress={() => navigation.navigate('Webview', {ak: accessKey})}>
            <Text style={styles.defaultButtonText}>Go to Webview</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WebviewScreen({route, navigation}: WebviewProps) {
  const {ak} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        allowsInlineMediaPlayback={true}
        // mediaPlaybackRequiresUserAction={false}
        cacheEnabled={false}
        ignoreSslError={true}
        style={styles.webview}
        //Refer to sample html file ""./assets/shoplive_list.html" , Please change to your own url
        source={{
          uri: `https://dongman2.github.io/shoplive-list/shoplive_list.html?ak=${ak}&test=18111fgarjr5`,
        }}
        onMessage={({nativeEvent}) => {
          const {type, data} = JSON.parse(nativeEvent.data);
          console.log('onMessage data:', data);
          if (type == 'playShoplive') {
            console.log(data);
            playShoplive(data.ak, data.campaign.campaignKey);
          }
        }}
      />
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    console.log('add listener');
    shoplive.onHandleNavigation((payload: EventData) => {
      console.log('addhandleNavigationEventListener ', payload);
    });
    shoplive.onDownloadCoupon((payload: EventData) => {
      console.log('addDownloadCouponEventListener ', payload);
    });
    

    shoplive.onReceivedCommand((payload: EventData) => {
      console.log('onReceivedCommand ', payload);
      if ('command' in payload) {
        const data = JSON.parse(payload.data);
        switch (payload.command) {
          case 'CLICK_PRODUCT_DETAIL':
            //need to check the payload!!!!!!ios!!!!!!!!!!!!
            if ('url' in data) console.log('click on product:', data.url);
            break;
        }
      }
    });

    shoplive.onError((payload: EventData) => {
      console.log('onError hahahaha', payload);
    });
    shoplive.onPlayerClosing((payload: EventData) => {
      console.log('onPlayerClosing hahahaha', payload);
      if (Platform.OS === 'ios') {
        console.log(`player is chaging to PIP / or being closed`);
      } else if (Platform.OS === 'android') {
        console.log(`playerClosing`);
      }
    });
    shoplive.onPlayerDestroyed((payload: EventData) => {
      console.log('onPlayerDestroyed hahahaha', payload);
      if (Platform.OS === 'ios') {
        console.log(`player has changed to PIP / or has closed`);
      } else if (Platform.OS === 'android') {
        console.log(`player closed`);
      }
    });
    shoplive.onPlayerCreated((payload: EventData) => {
      console.log('onPlayerCreated hahahaha', payload);
    });

    // Removes the listener once unmounted
    return () => {
      console.log('remove listener');
      shoplive.removeListeners();
    };
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Webview" component={WebviewScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'lightblue',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
  },

  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  defaultButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  defaultButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  webview: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  label: {
    width: 110,
    marginRight: 10,
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  input: {
    color: 'black',
    height: 40,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default App;
