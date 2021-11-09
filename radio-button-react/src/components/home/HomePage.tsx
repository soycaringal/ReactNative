import React from 'react'

import {
  useMenuList
} from '~/components/home'

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

/**
 * HomePage Index Page
 *
 * @param {Object} props
 * @return {ReactElement}
 */
const HomePage: React.FC = (props: any): React.ReactElement => {
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
  const checkInput = (e: any): void => {
    // get input data
    const group = parseInt(e.target.dataset.group);
    const value = e.currentTarget.value;
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
      && (group + 1) >= groups.length) 
    {
      let inputGroup = menus[group + 1].map((val: any) => val.id )

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
  const submitForm = (e: any): void => {
    setState((prev: any) => {
      return {
        ...prev,
        successMessage: true,
      }
    });
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
        <div className={`input-group ${disabled ? 'opacity-25' : ''}`}>
          <div className="input-group-prepend">
            <div className="input-group-text">
              <label>
                <input 
                  disabled={disabled} 
                  checked={v.isChecked} 
                  name={`group-${group}`} 
                  data-group={group} 
                  onClick={checkInput} 
                  type="radio" 
                  value={v.id}
                  />
                <span className="ml-2">{v.value}</span>
              </label>
            </div>
          </div>
        </div>
      )
    });
  }

  /**
   * Render the Menu list
   *
   * @return {ReactElement}
   */
  const renderList =  (): React.ReactElement => {
    return menus.map((menu: any, group: number): React.ReactElement => {
      return (
        <div className="card">
          <div className="card-header">
            Category  {group + 1}
          </div>
          <div className="card-body">
            <div className="col">
              {renderMenu(menu, group)}
            </div>
        </div>
      </div>
      )
    });
  };

  return (
    <div className="home-page container pt-5 text-center w-50">
      {/* START: Succes Message */}
      {successMessage ? (
        <div className="alert alert-success">
          <strong>Success!</strong>
        </div>
      ) : ''}
      {/* END: Succes Message */}

      {/* START: Container */}
      <div className="card text-center">
        <div className="card-header">
          <h3 className="mx-auto header">
            Choose:
          </h3>
        </div>
        {/* START: Category List */}
        <div className="card-body">
          <div className="d-flex">
            {renderList()}
          </div>
        </div>
        {/* END: Category List */}

        {/* START: Card Footer */}
        <div className="card-footer text-muted">
          <button
            disabled={!showButton}
            onClick={submitForm}
            className="btn btn-success mx-auto btn-lg w-25"
          >
            Submit
          </button>
        </div>
        {/* END: Card Footer */}
      </div>
      {/* END: Container */}
    </div>
  )
}

export default HomePage;
