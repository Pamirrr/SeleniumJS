var util = require('../utilities.js'),
    nav = require('../navigation.js'),
    jur = require('../jurisdictions.js'),
    test = require('../testdata.js');

var webdriver = util.webdriver,
    driver = util.driver,
    By = util.By,
    until = util.until;

var assert = util.assert,
    fs = util.fs;

util.catchUncaughtExceptions();

var statementOfIntent = function() {
    
    var surrElements = By.xpath("//div[starts-with(@id, 'statementOfIntent')]//input[@id='planOptions_PlanIntentionsRadio' and @value='Intentions']");
    
    driver.wait(until.elementIsVisible(driver.findElement(nav.navMatter.petition.statementOfIntent)), 5000).then(function() {
        driver.findElement(nav.navMatter.petition.statementOfIntent).click();
        
        driver.wait(until.elementLocated(surrElements), 15000).then(function() {
            
            driver.sleep(1000);
            driver.findElements(surrElements).then(function(amount) {
                for (var index = 1; index <= amount.length; index++) {
                    driver.findElement(By.xpath("//div[starts-with(@id, 'statementOfIntent')]//div[starts-with(@class, 'row border-bottom')][" + index + "]//input[@id='planOptions_PlanIntentionsRadio' and @value='Intentions']")).click();
                    
                }
            });

            driver.findElement(By.xpath("//div[starts-with(@id, 'statementOfIntent_')]//div[@class='button-set ']/button")).click();
            driver.sleep(2000);
            
        }, function(err) {
            //no items
        });
    }, function(notFound) {
        driver.isElementPresent(nav.navMatter.petition.plan);
    });
        
};

module.exports.statementOfIntent = statementOfIntent;