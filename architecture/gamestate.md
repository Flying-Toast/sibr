# Game State architecture

## Details
- The server sends game state updates at a fixed interval (set in source/sibr/config.d).
- Game state updates do not necessarily contain the entire state of the game. Rather, they just contain the information that has *changed* since the last update. Therefore, it is up to the frontend to store the current game state and apply the update's changes to it.
- Because updates don't contain the entire game state, new clients first need some way of getting the whole state. This is done using the 'welcome message' (see networking architecture). The welcome mesage describes the current game state, to which changes described in the following updates will be applied.





---
***none of this is actually implemented yet, it is just notes for later***