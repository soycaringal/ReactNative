import React from 'react'
import {
  Route,
  Routes
} from 'react-router-dom'
import { Home } from '~components'


/**
 * App Routes
 *
 * @param {Object} props
 * @return {ReactElement}
 */
const Routes2: React.FC = (props: any): React.ReactElement => {
 
  return (
      <Routes>
      <Route path="/" element={<Home.HomePage/>} />
      </Routes>
  )
}

export default Routes2;
