var HTTP = require('../services/httpservice');
var Reflux = require('reflux');
var Actions = require('./actions.jsx');

var ingredientStore = Reflux.createStore({
    listenables: [Actions],
    getIngredients: function() {
      HTTP.get('/ingredients')
      .then(function(json) {
        //can be anything --> this.ingredients
        this.ingredients = json;
        this.fireUpdate();
      }.bind(this));
    },
    postIngredient: function(text) {

      if(!this.ingredients) {
        this.ingredients = [];
      }

      var ingredient = {
        "text": text,
        "id": Math.floor(Date.now() / 1000) + text
      };

      this.ingredients.push(ingredient);
      this.fireUpdate();

      HTTP.post('/ingredients', ingredient)
      .then(function(response) {
        this.getIngredients();
      }.bind(this));

    },
    fireUpdate: function() {
      this.trigger('change', this.ingredients);
    }
});

module.exports = ingredientStore;
