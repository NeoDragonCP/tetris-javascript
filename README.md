# Tetris

Coding in Javasript, with HTML/CSS.
Link to play: https://neodragoncp.github.io/tetris-javascript/

- STILL WORK IN PROGRESS

I recently came across coding a Tetris game in Javascript by Ania Kubow.

Her video: https://www.youtube.com/watch?v=rAUn1Lom6dw&list=WL&index=17&t=0s

Originally I was doing it as just a bit of fun/practice but ended up doing my own take on the project.

## Improvements I made:

Generated all of the grid divs (for displaying of the pieces) in Javascript rather than writing them all in the HTML file.
Refactored code with improved readability to variable names and less repeating of the code in general.
Broke out the Tetrominos into their own file. Functions for movement and rotation have safety checks that the CurrentTetromino is valid.
Organized the CSS better and used variables for better control.
Custom design overall.

## Known bugs:

- Scoring a point (completing a line) can cause the next falling Tetromino to double up on it's upper line.
- Changing rotation near a wall of the grid will cause some of the shape to flip over to the other side.
- Not a bug as such but I just randomly assign a color to each piece. Really each shape should have it's own color (eg. line Tetromino is only blue).
