var req = require('../src/commonFunctions.js'),
    nav = require('../src/navigation.js'),
    test = require('../src/testdata.js');

var webdriver = req.webdriver,
    driver = req.driver,
    By = req.By,
    until = req.until;

var assert = req.assert,
    fs = req.fs;

driver.manage().timeouts().implicitlyWait(2000);
req.catchUncaughtExceptions();

var createActivity = function() {
    
    driver.wait(until.elementLocated(By.xpath("//select[@id='modelObject_ListTypeId']")), 10000);
    var saveBtn = driver.findElement(By.xpath("//section[starts-with(@id, 'Activity_')]//button[@type='submit']"));
    
    driver.findElement(By.xpath("//select[@id='modelObject_ListTypeId']/option[@value='19']")).click();
    driver.findElement(By.id('modelObject_Duration_days')).sendKeys('2');
    driver.findElement(By.id('modelObject_Duration_hours')).sendKeys('4');
    driver.findElement(By.id('modelObject_Duration_minutes')).sendKeys('6');
    driver.findElement(By.id('modelObject_Description')).sendKeys('This is some nice activity description');
    driver.findElement(By.xpath("//div[starts-with(@id, 'cases_listActivity_View_')]//button[contains(@class, 'btn-search')]")).click().then(function() {
        driver.wait(until.elementLocated(nav.dvxprsPopupFirstRow), 10000);
        driver.sleep(1500);
        driver.findElement(nav.dvxprsPopupFirstRow).click();
        driver.sleep(1500);
    }, function(err) {
        //in a matter, the acitivity is already associated
    });
    driver.findElement(By.xpath("//div[starts-with(@id, 'contacts_listActivity_View_')]//button[contains(@class, 'btn-search')]")).click().then(function() {
        driver.wait(until.elementLocated(nav.dvxprsPopupFirstRow), 10000);
        driver.sleep(1500);
        driver.findElement(nav.dvxprsPopupFirstRow).click();
        driver.sleep(1500);
    }, function(err) {
        //in a contact, the acitivity is already associated
    });
    
    saveBtn.click();
    driver.wait(until.stalenessOf(saveBtn), 5000);
    
};

var dashboardActivities = function() {
    
    var emptyRow = By.xpath("//div[@data-pe-gridviewtabletype='activitiesGridView']//tr[contains(@id, 'DXEmptyRow')]"),
        firstRow = By.xpath("//div[@data-pe-gridviewtabletype='activitiesGridView']//tr[contains(@id, 'DXDataRow0')]"),
        newBtn = By.xpath("//div[@data-pe-gridviewtabletype='activitiesGridView']//a[contains(@class, 'gridBtn-new')]");
        
    driver.wait(until.elementLocated(nav.navBar.view.self), 5000);
    driver.findElement(nav.navBar.view.self).click();
    driver.wait(until.elementIsEnabled(driver.findElement(nav.navBar.view.activities)), 5000);
    driver.findElement(nav.navBar.view.activities).click();
    
    driver.wait(until.elementLocated(firstRow), 10000);
    driver.wait(until.elementLocated(newBtn), 10000);
    
    //add
    driver.findElement(newBtn).click();
    
    createActivity();
    
    //update
    driver.findElement(By.xpath("//table[contains(@id, 'DXHeaderTable')]//input[contains(@id, 'DXFREditorcol2_I')]")).sendKeys('This is some nice activity description');
    driver.sleep(3000);
    driver.findElement(firstRow).click();
    
    driver.wait(until.elementLocated(By.id('modelObject_Description')), 10000);
    driver.findElement(By.id('modelObject_Description')).clear();
    driver.findElement(By.id('modelObject_Description')).sendKeys('Updated');
    driver.findElement(By.xpath("//section[starts-with(@id, 'Activity_')]//button[@type='submit']")).click();
    driver.sleep(3000);
    driver.findElement(By.xpath("//table[contains(@id, 'DXHeaderTable')]//input[contains(@id, 'DXFREditorcol2_I')]")).clear();
    driver.findElement(By.xpath("//table[contains(@id, 'DXHeaderTable')]//input[contains(@id, 'DXFREditorcol2_I')]")).sendKeys('Updated');
    driver.sleep(3000);
    driver.findElement(By.xpath("//div[@data-pe-gridviewtabletype='activitiesGridView']//tr[contains(@id, 'DXDataRow0')]//td[6]/a")).click();
    req.confirmDelete();
    driver.wait(until.elementLocated(emptyRow), 10000);
    
};



var contactActivities = function() {
  
    var activitiesTab = By.xpath("//div[starts-with(@id, 'entityEventTabs')]//a[text()='Activities']");
    
    var newBtn = By.xpath("//div[@data-pe-gridviewtabletype='activitiesGridView']//a[contains(@class, 'gridBtn-new')]"),
        firstRow = By.xpath("//div[@data-pe-gridviewtabletype='activitiesGridView']//tr[contains(@id, 'DXDataRow0')]"),
        emptyRow = By.xpath("//div[@data-pe-gridviewtabletype='activitiesGridView']//tr[contains(@id, 'DXEmptyRow')]");
        
        
    var activitiesEmptyRow = By.xpath("//div[starts-with(@id, 'activities_entityEventTabs')]//tr[contains(@id, 'DXEmptyRow')]");
    
    driver.wait(until.elementLocated(nav.navContact.profile.events));
    driver.findElement(nav.navContact.profile.events).click();
    driver.wait(until.elementLocated(activitiesTab), 5000);
    driver.findElement(activitiesTab).click();
    driver.wait(until.elementLocated(newBtn), 5000);
    
    //add
    driver.findElement(newBtn).click();
    
    createActivity();
    
    //update
    driver.findElement(firstRow).click();
    
    driver.wait(until.elementLocated(By.id('modelObject_Description')), 10000);
    driver.findElement(By.id('modelObject_Description')).clear();
    driver.findElement(By.id('modelObject_Description')).sendKeys('Updated');
    driver.findElement(By.xpath("//section[starts-with(@id, 'Activity_')]//button[@type='submit']")).click();
    driver.sleep(2000);
    driver.findElement(By.xpath("//div[@data-pe-gridviewtabletype='activitiesGridView']//tr[contains(@id, 'DXDataRow0')]//td[6]/a")).click();
    req.confirmDelete();
    driver.wait(until.elementLocated(emptyRow), 10000);
};

var overviewActivities = function() {
    
    var viewAllBtn = By.id('viewActivities'),
        addBtn = By.id('addActivity');
    
    //viewAllBtn check
    driver.wait(until.elementLocated(viewAllBtn), 15000);
    driver.findElement(viewAllBtn).click();
    
    driver.wait(until.elementLocated(By.xpath("//div[starts-with(@id, 'CaseViewActivities')]//tr[contains(@class, 'EmptyDataRow')]")), 15000);
    driver.sleep(1000);
    driver.findElement(nav.navMatter.overview).click();
    driver.wait(until.elementLocated(addBtn), 15000);
    
    //add activity
    driver.sleep(1500);
    driver.findElement(addBtn).click();
    createActivity();
    var activityOverviewName = By.xpath("//div[starts-with(@id, 'CaseOverviewActivityHistory')]//tbody[@id='dataView']/tr/td[2]");
    driver.wait(until.elementLocated(activityOverviewName), 15000);
    var activityOverviewNameEl = driver.findElement(activityOverviewName);
    activityOverviewNameEl.getText().then(function (name) {
        assert.equal(name, 'This is some nice activity description')
    });
    activityOverviewNameEl.click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'title') and text()='Update Activity']")), 15000);
    driver.findElement(By.className('btn-close')).click();
    driver.sleep(1000);
};


var matterActivities = function() {
    
    driver.findElement(nav.navMatter.events.self).click();
    driver.wait(until.elementLocated(nav.navMatter.events.activities), 15000);
    driver.sleep(1000);
    driver.findElement(nav.navMatter.events.activities).click();
    var firstRow = By.xpath("//div[starts-with(@id, 'CaseViewActivities')]//tr[contains(@id, '_DXDataRow0')]");
    driver.wait(until.elementLocated(firstRow), 15000);
    
    //canceBtn check
    driver.findElement(By.xpath("//div[starts-with(@id, 'CaseViewActivities')]//a[contains(@class, 'gridBtn-new')]")).click();
    var cancelBtn = By.xpath("//div[starts-with(@id, 'CaseViewActivities_')]//button[contains(@class, 'closeButton')]");
    driver.wait(until.elementLocated(cancelBtn), 15000);
    driver.findElement(cancelBtn).click();
    
    //update existing entry
    driver.sleep(2000);
    driver.findElement(firstRow).click();
    driver.wait(until.elementLocated(cancelBtn), 15000);
    driver.findElement(By.id('modelObject_Description')).clear();
    driver.findElement(By.id('modelObject_Description')).sendKeys('Updated');
    driver.findElement(By.xpath("//div[starts-with(@id, 'CaseViewActivities_')]//section[starts-with(@id, 'Activity_')]//button[@type='submit']")).click();
    driver.wait(until.elementLocated(firstRow), 15000);
    
    //delete
    driver.findElement(By.xpath("//div[starts-with(@id, 'CaseViewActivities')]//tr[contains(@id, '_DXDataRow0')]//a")).click();
    req.confirmDelete();
    driver.wait(until.elementLocated(By.xpath("//div[starts-with(@id, 'CaseViewActivities')]//tr[contains(@id, '_DXEmptyRow')]")), 15000);
};

module.exports = {
    dashboardActivities: dashboardActivities,
    contactActivities: contactActivities,
    overviewActivities: overviewActivities,
    matterActivities: matterActivities
};