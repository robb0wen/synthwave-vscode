(function () {

  // Grab body node
  const bodyNode = document.querySelector('body');

  // Replace the styles with the glow theme
  const initNeonDreams = (disableGlow, obs) => {
    var themeStyleTag = document.querySelector('.vscode-tokens-styles');

    if (!themeStyleTag) {
      return;
    }

    var initialThemeStyles = themeStyleTag.innerText;
    
    var updatedThemeStyles = initialThemeStyles;
    
    if (!disableGlow) {
      /* replace neon red */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #fe4450;/g, "color: #fff5f6; text-shadow: 0 0 2px #000, 0 0 10px #fc1f2c[NEON_BRIGHTNESS], 0 0 5px #fc1f2c[NEON_BRIGHTNESS], 0 0 25px #fc1f2c[NEON_BRIGHTNESS]; backface-visibility: hidden;");
      
      /* replace neon pink */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #ff7edb;/g, "color: #f92aad; text-shadow: 0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3; backface-visibility: hidden;");
      
      /* replace yellow */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #fede5d;/g, "color: #f4eee4; text-shadow: 0 0 2px #393a33, 0 0 8px #f39f05[NEON_BRIGHTNESS], 0 0 2px #f39f05[NEON_BRIGHTNESS]; backface-visibility: hidden;");
      
      /* replace green */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #72f1b8;/g, "color: #72f1b8; text-shadow: 0 0 2px #100c0f, 0 0 10px #257c55[NEON_BRIGHTNESS], 0 0 35px #212724[NEON_BRIGHTNESS]; backface-visibility: hidden;");
      
      /* replace blue */
      updatedThemeStyles = updatedThemeStyles.replace(/color: #36f9f6;/g, "color: #fdfdfd; text-shadow: 0 0 2px #001716, 0 0 3px #03edf9[NEON_BRIGHTNESS], 0 0 5px #03edf9[NEON_BRIGHTNESS], 0 0 8px #03edf9[NEON_BRIGHTNESS]; backface-visibility: hidden;");
    }

    /* append the remaining styles */
    updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`;

    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute("id", "synthwave-84-theme-styles");
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');
    document.body.appendChild(newStyleTag);
    
    console.log('Synthwave \'84: NEON DREAMS initialised!');
    
    // disconnect the observer because we don't need it anymore
    if (obs) {
      obs.disconnect();
      obs = null;
    }
  };

  // Callback function to execute when mutations are observed
  const watchForBootstrap = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
          if (mutation.type === 'attributes') {
            // only init if we're using a Synthwave 84 subtheme
            const isUsingSynthwave = document.querySelector('[class*="RobbOwen-synthwave-vscode-themes"]');
            // does the style div exist yet?
            const tokensLoaded = document.querySelector('.vscode-tokens-styles');
            // does it have content ?
            const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText 
                                && document.querySelector('.vscode-tokens-styles').innerText !== '';

            if (isUsingSynthwave && tokensLoaded) {
              if (!tokenStyles) {
                // sometimes VS code takes a while to init the styles content, so if there stop this observer and add an observer for that
                observer.disconnect();
                observer.observe(tokensLoaded, { childList: true });
              } else {
                // If everything we need is ready, then initialise
                initNeonDreams([DISABLE_GLOW], observer);
              }
            }
          }
          if (mutation.type === 'childList') {
            const isUsingSynthwave = document.querySelector('[class*="RobbOwen-synthwave-vscode-themes"]');
            const tokensLoaded = document.querySelector('.vscode-tokens-styles');
            const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText 
                                && document.querySelector('.vscode-tokens-styles').innerText !== '';

            // Everything we need is ready, so initialise
            if (isUsingSynthwave && tokensLoaded && tokenStyles) {
                initNeonDreams([DISABLE_GLOW], observer);
            }
          }
      }
  };

  // try to initialise the theme
  initNeonDreams([DISABLE_GLOW]);

  // Use a mutation observer to check when we can bootstrap the theme
  const observer = new MutationObserver(watchForBootstrap);
  observer.observe(bodyNode, { attributes: true });

})();