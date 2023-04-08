# Problems with the tests:

Although all of them work correctly sometimes, there is a race condition ocurring. As most of them depend on the id of the returned value from the database, most of the time they will error depending on the order in which the jasmine-js package runs the test.

## What you can do:

Run the tests more than once, as in some of them they will all run correctly, which implies that the functions are all correct.
