import React, {Suspense} from 'react'
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
import {AsyncEffects} from './examples/AsyncEffect'
import {AsyncEffects2} from './examples/AsyncEffect2'

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
                        <Route path="/examples/asynceffect">
                            <Suspense fallback={<div>Loading...</div>}>
                                <AsyncEffects />
                            </Suspense>
                        </Route>
                        <Route path="/examples/asynceffect2">
                            <Suspense fallback={<div>Loading...</div>}>
                                <AsyncEffects2 />
                            </Suspense>
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
