import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Button, RadioButton } from 'react-native-paper';
import  useMenuList from './useMenuList'
import Toast from 'react-native-simple-toast';

/**
 * Initial form state
 *
 * @type {Object}
 */
const initialState = {
  inputs: [],
  groups: {},
  selected: {
    0: true
  },
  showButton: false,
  successMessage: false
}

const Section: React.FC<{
  title: string;
}> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const [state, setState] = React.useState<any>(initialState)
  const { showButton, successMessage } = state;

  // menu list hook
  const {
    menus,
    inputs,
    rules,
  } = useMenuList({
  });

  /**
   * Reset Group Onwards Checked
   *
   * @param {Any} props
   * @return {void}
   */
  const resetChecked = (group: any): void => {
    menus.map((item: any, key: any) => {
      return item.map((item: any) => {
        if (key > group) {
          return item.isChecked = false;
        }
      })
    })
  }

  /**
   * Check Radio Input
   *
   * @param {Any} props
   * @return {void}
   */
  const checkInput = (group: any, value: any): void => {
    // get input data
    let { groups, selected } = state;

    // reset checked first
    resetChecked(group);

    // assign isChecked 
    menus[group].map((item: any) => {
      item.isChecked = false;
      if (item.id === value) {
        item.isChecked = true;
      }
    })

    // set group selected
    groups[group] = value;
    selected[group + 1] = true;

    // update state
    setState((prev: any) => {
      return {
        ...prev,
        ...groups
      }
    });

    // check input rules
    if (!rules[value]
      && (group + 1) >= groups.length) {
      let inputGroup = menus[group + 1].map((val: any) => val.id)

      let removeInputs: any = state.inputs.filter((item: any) => !inputGroup.includes(item))

      // update state
      setState((prev: any) => {
        return {
          ...prev,
          inputs: removeInputs
        }
      });

      return;
    }

    let inputGroups: any = [];

    // check groups by rules
    Object.keys(groups).map((i: any) => {
      if (rules[groups[i]]) {
        let inputGroupbyRule: any = inputs.filter((item: any) => rules[groups[i]].includes(parseInt(item)))

        inputGroups = [...inputGroups, ...inputGroupbyRule]
      }
    });

    // update state
    setState((prev: any) => {
      return {
        ...prev,
        inputs: inputGroups,
      }
    });

    // validate selected items
    if (Object.keys(groups).length === menus.length) {
      // update state
      setState((prev: any) => {
        return {
          ...prev,
          showButton: true,
        }
      });
    }
  }

  /**
   * Submit Form
   *
   * @param {Any} props
   * @return {void}
   */
  const submitForm = (): void => {
    Toast.show('Success!');
  }

  /**
   * Render Menu Item
   *
   * @param {Object} props
   * @return {ReactElement}
   */
  const renderMenu = (menu: any, group: any): React.ReactElement => {
    const defaultInputs = state.inputs.length === 0 ? inputs : state.inputs;
    const { selected } = state;

    return menu.map((v: any, i: any): React.ReactElement => {
      let disabled: any = defaultInputs.includes(v.id) || !selected[group] ? true : false
      return (
        <RadioButton.Item 
          key={i}
          disabled={disabled}
          label={v.value}
          onPress={() => checkInput(group, v.id)}
          data-group={group}
          status={v.isChecked ? 'checked' : 'unchecked'}
          value="first"
        />
    )
    });
  }

  /**
   * Render the Menu list
   *
   * @return {ReactElement}
   */
  const renderList = (): React.ReactElement => {
    return menus.map((menu: any, group: number): React.ReactElement => {
      return (
        <Section key={group} title={`Category  ${group + 1}`}>
          <View>
              {renderMenu(menu, group)}
          </View>
        </Section>
      )
    });
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#1abc9c',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Header /> */}
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: Colors.white,
                fontWeight: 'bold',
                paddingBottom: 15,
              },
            ]}>CHOOSE:</Text>
        </View>
        
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View>
            {renderList()}
          </View>
          <View>
            <Button
              mode="contained"
              disabled={!showButton}
              onPress={() => submitForm()}
            >
              Submit
            </Button>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    alignItems:'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
