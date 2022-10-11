import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Canvas from './Canvas'
import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {RecoilRoot} from 'recoil'
import {Atoms} from './examples/Atoms'
import {Selectors} from './examples/Selectors'
import {Async} from './examples/Async'
import {AtomEffects} from './examples/AtomEffect'
import {AtomFamilyEffects} from './examples/AtomFamilyEffect'

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <ChakraProvider>
                <Router>
                    <Switch>
                        <Route path="/examples/atoms">
                            <Atoms />
                        </Route>
                        <Route path="/examples/async">
                            <Async />
                        </Route>
                        <Route path="/examples/selectors">
                            <Selectors />
                        </Route>
                        <Route path="/examples/atomeffect">
                            <AtomEffects />
                        </Route>
                        <Route path="/examples/afe">
                            <AtomFamilyEffects />
                        </Route>
                        <Route>
                            <Canvas />
                        </Route>
                    </Switch>
                </Router>
            </ChakraProvider>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById('root'),
)
