/*global unexpected:true*/
/* eslint no-unused-vars: "off" */
unexpected = window.weknowhow.expect.clone();
unexpected.installPlugin(window.weknowhow.unexpectedSinon);
unexpected.output.preferredWidth = 80;
