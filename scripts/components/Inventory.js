/*
    Inventory 
    <Inventory/>
*/
import React from 'react';
import config from '../config';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import firebase from 'firebase';

// unchangeable variable es6
const ref = new firebase.initializeApp(config);;


// Inventory class
@autobind
class Inventory extends React.Component {

    constructor() {
        super();

        this.state = {
            uid : '',
            owner : ''
        }
    }

    switchProvider(provider) {
        switch(provider) {
            case 'github' :
                var authProvider = new firebase.auth.GithubAuthProvider();
                break;
            
            case 'twitter' :
                var authProvider = new firebase.auth.TwitterAuthProvider();
                break;

            case 'google' :
                var authProvider = new firebase.auth.GoogleAuthProvider();
                break;
           
        }
        
        return authProvider;
    }    

    authenticate(provider) {
        var auth = firebase.auth();
        var authProvider = this.switchProvider(provider);

        console.log('trying to auth with ' + provider);
        console.log(authProvider);

        auth.signInWithPopup(authProvider).then(function(result) {
            // User signed in!
            var uid = result.user.uid;

            console.log(result);

            console.log(this.props.params.storeID);
            const storeRef = ref.child(this.props.params.storeID);


        }).catch(function(err) {
            console.log(err);
            return;
        });        
    }

    renderLogin(){
        return (
            <nav className="login">
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={this.authenticate.bind(this,'github')}>Log In With Github</button>
                <button className="twitter" onClick={this.authenticate.bind(this,'twitter')}>Log In With Twitter</button>
                <button className="facebook" onClick={this.authenticate.bind(this,'google')}>Log In With Google</button>                
            </nav>
        )
    }

    renderInventory(key) {
        var linkState = this.props.linkState;
        return (
            <div className="fish-edit" key={key}>
                <input type="text" valueLink={linkState('fishes.'+ key +'.name')}/>
                <input type="text" valueLink={linkState('fishes.'+ key +'.price')}/>
                <select valueLink={linkState('fishes.'+key+'.status')}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold out!</option>
                </select>
                <textarea valueLink={linkState('fishes.'+ key +'.desc')}></textarea>
                <input type="text" valueLink={linkState('fishes.'+ key +'.image')}/>
                <button onClick={this.props.removeFish.bind(null, key)}>Remove fish</button>
            </div>
        )
    }

    render(){

        let logoutButton = <button>Log out!</button>

        // first check if logged in or not
        if(!this.state.uid) {
            return (
                <div>
                    {this.renderLogin()}
                </div>
            )
        }
        // then check if they arent the owner of the current store
        if(this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry, you aren't the owner of this store.</p>
                    {logoutButton}
                </div>
            )
        }

        return (
            <div>
                <h2>Inventory</h2>
                {logoutButton}

                {Object.keys(this.props.fishes).map(this.renderInventory)}

                <AddFishForm {...this.props} />
                <button onClick={this.props.loadSamples}>Load sample fishes</button>
            </div>
        )
    }
};

// Inventory propTypes
Inventory.propTypes = {
    addFish : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    fishes : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired,
}

export default Inventory;