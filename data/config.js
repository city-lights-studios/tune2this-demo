/* ==========================================================================
   Tune2This — Phase 0 runtime config
   ---------------------------------------------------------------------------
   The only file you edit to turn the demo's forms into real ones.

   • formEndpoint: paste your Formspree form URL here. As soon as it's set, the
     Contact, Booking, Artist-application and Join forms POST to your inbox.
   • Until it's set, those forms fall back to opening the visitor's own email
     app (mailto) so they still do something testable today.

   No secrets belong in here beyond a public form key — this file ships to the
   browser. (Formspree/Web3Forms keys are designed to be public-facing.)
   ========================================================================== */
window.T2T_CONFIG = {
  contactEmail: "CityLightsRecordingStudio@gmail.com",

  // Formspree: create a form, paste its endpoint, e.g. "https://formspree.io/f/abcdwxyz"
  formEndpoint: "https://formspree.io/f/mzedbnvl",
  formService: "formspree",   // "formspree" | "web3forms"
  web3formsKey: ""            // only if formService === "web3forms"
};
