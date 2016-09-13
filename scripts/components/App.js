/* 
    App
    <App/>
*/
import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import config from '../config';

// Firebase
import Rebase from 're-base';
    var base = Rebase.createClass(config.databaseURL);

import Header from './Header';
import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';



@autobind
class App extends React.Component {
    
    constructor(){
        super();

        this.state = {
            fishes : {},
            order : {}
        }
    }


    // Load stuff after page render
    componentDidMount() {
        base.syncState(this.props.params.storeId + '/fishes', {
            context : this,
            state : 'fishes'
        });


        var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);
    
        if (localStorageRef) {
            // update our component to reflect what is in localStorage
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
        
    }

    // Save changes in localStorage
    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
    }

    addToOrder(key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({order : this.state.order });
    }

    removeFromOrder(key) {
        delete this.state.order[key];
        this.setState({ 
            order : this.state.order // update order state
        });
    }

    addFish(fish) {
        var timestamp = (new Date()).getTime();

        // update state object
        this.state.fishes['fish-' + timestamp] = fish;
        // set the state
        this.setState({ fishes : this.state.fishes });
    }

    removeFish(key) {
        if(confirm('Are you sure you want to remove this fish?')) {
            this.state.fishes[key] = null;
            this.setState({
                fishes : this.state.fishes
            });
        }
    }

    renderFish(key) {
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
    }

    loadSamples() {
        this.setState({
            fishes : require('../sample-fishes')
        });
    }
    render(){ 
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order}  removeFromOrder={this.removeFromOrder}/>
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState.bind(this)} removeFish={this.removeFish}/>
            </div>
        )
    }

};

reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;