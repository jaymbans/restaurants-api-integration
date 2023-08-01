const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { restaurants } = require("./restaurants");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const starred = ALL_RESTAURANTS.filter(restaurant => {
    return restaurant.id === id;
  })[0]

  if (!starred) {
    res.send(404)
    return;
  }

  starred.comment = STARRED_RESTAURANTS.filter(restaurant => {
    return restaurant.restaurantId = id;
  })[0].comment;

  res.json(starred);
})


/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post('/', (req, res) => {
  // figure out the name and ID
  const restaurantId = req.body.id;

  const starName = ALL_RESTAURANTS.filter(restaurant => {
    return restaurant.id === restaurantId;
  })[0].name;

  const id = uuidv4();

  const newStar = {
    id,
    restaurantId,
    name: starName
  }

  STARRED_RESTAURANTS.push(newStar);

  res.send(newStar)
})



/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  STARRED_RESTAURANTS = STARRED_RESTAURANTS.filter(restaurant => {
    return restaurant.id !== id;
  })

  res.sendStatus(200)

})



/**
 * Feature 10: Updating your comment of a starred restaurant.
 */

router.put('/:id', (req, res) => {
  // grab comment and id
  const { newComment } = req.body;
  const { id } = req.params;

  // find the restaurant in the starred list
  for (let restaurant of STARRED_RESTAURANTS) {
    if (restaurant.id === id) {
      restaurant.comment = newComment;
    }
  }

  res.send(200)

})



module.exports = router;