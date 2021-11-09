import React from 'react'

/**
 * Initial state
 *
 * @type {Object}
 */
const initialState: any = {
  inputs: [],
  menus: [],
  groups: [],
  rules: []
}

/**
 * useMenuList Hook
 *
 * @param {Object} props
 * @return {Object}
 */
const useMenuList = (props?: any): any => {
  // Menu state
  const [ state, setState ] = React.useState<any>(initialState);

  /**
   * Get API Response
   *
   * @return {Promise}
   */
  const apiResponse = async (): Promise<any> => {
    return {
      menus: [
        // first group of radio-buttons
        [
          { id: '101', value: 'Vegetarian' },
          { id: '102', value: 'Nut allergy' },
          { id: '103', value: 'Halal' }
        ],
        // second group of radio-buttons
        [
          { id: '201', value: 'Cashew chicken' },
          { id: '202', value: 'Sweet and sour pork' },
          { id: '203', value: 'Stir fried Tofu' },
          { id: '204', value: 'Vegetable fried rice' },
          { id: '205', value: 'Pad Thai' },
          { id: '206', value: 'Massaman beef' },
        ],
        // third group of radio-buttons
        [
          { id: '301', value: 'Peanut sauce' },
          { id: '302', value: 'Oyster sauce' },
          { id: '303', value: 'Vegetable spring rolls' },
          { id: '304', value: 'Steamed rice' },
        ],
      ],
      rules: {
        // 'Vegetarian' is NOT compatible with 'Cashew chicken', 'Sweet and sour pork', 'Massaman beef', 'Oyster sauce'
        101: [201, 202, 206, 302],
        // 'Nut allergy' is NOT compatible with 'Cashew chicken', 'Peanut sauce',
        102: [201, 301],
        // 'Halal' is NOT compatible with 'Sweet and sour pork',
        103: [202],
        // 'Vegetable fried rice' is NOT compatible with 'Steamed rice' (you don't need more rice... carb overload),
        204: [304],
        // 'Pad thai' is NOT compatible with 'Steamed rice' (Pad thai comes with noodles),
        205: [304],
      }
    };
  };

  /**
   * Get Menu request
   *
   * @return {Promise}
   */
  const getMenus = React.useCallback(async(): Promise<any> => {
    // send off request
    let response: any = await apiResponse();

    if (response) {
      response.menus.map((item: any, group: any) => {
        item.map((val: any) => {
          val.isChecked = false;
          if (group !== 0) {
            setState((prev: any) => {
              let inputs: any = state.inputs;
              inputs.push(val.id)
              return {
                ...prev,
                ...inputs,
              }
            });
          }
        });
      });
    }
    
    // update state
    setState((prev: any) => {
      return {
        ...prev,
        menus: response.menus || [],
        rules: response.rules || [],
      }
    });
  }, []);


  /**
   * Get Menu list effect
   *
   * @type {Function}
   */
  React.useEffect(() => {
    getMenus();
    return () => {
      // reset state
      setState(initialState);
    }
  }, [
    getMenus
  ]);

  return {
    ...state,
    getMenus
  }
}

export default useMenuList;