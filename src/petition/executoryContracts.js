var req = require('../commonFunctions.js'),
    nav = require('../navigation.js'),
    efp = require('../efilingparams.js'),
    test = require('../testdata.js');

var webdriver = req.webdriver,
    driver = req.driver,
    By = req.By,
    until = req.until;

var assert = req.assert,
    fs = req.fs;

req.catchUncaughtExceptions();

var executoryContracts = function() {
    
    var emptyRow = By.xpath("//div[starts-with(@id, 'CaseExecutoryContracts_')]//tr[contains(@id, 'DXEmptyRow')]"),
        firstRow = By.xpath("//div[starts-with(@id, 'CaseExecutoryContracts_')]//tr[contains(@id, 'DXDataRow0')]"),
        newBtn = By.xpath("//div[starts-with(@id, 'CaseExecutoryContracts_')]//a[contains(@class, 'gridBtn-new')]"),
        saveBtn = By.xpath("//section[starts-with(@id, 'CreateUpdateCaseExecutoryContract_')]//button[@type='submit']");
        //cancelBtn = By.xpath("//section[starts-with(@id, 'CreateUpdateCaseExecutoryContract_')]//button[@data-role-action='close']");
        
    var searchBtn = By.xpath("//div[starts-with(@id, 'CaseExecutoryContracts_')]//button[contains(@class, 'btn-search')]"),
        typeOfContract = By.id("modelObject_Type"),
        //relationship = By.id("executoryContract_DebtorRelationshipToContract"),
        description = By.id("modelObject_Description"),
        //assume = By.xpath("//*[@value='Assume']"),
        reject = By.xpath("//*[@value='Reject']"),
        //assign = By.xpath("//*[@value='Assign']"),
        unknown = By.xpath("//*[@value='Unknown']"),
        isInDefault = By.id("modelObject_IsInDefault"),
        exclude = By.id("modelObject_ExcludeFromMailingMatrix");
    
    var planOptions = By.xpath("//*[starts-with(@id, 'CreateUpdateCaseExecutoryContract')]//div[@data-role='panel']"),
        regularPayment = By.xpath("//*[@id='modelObject_RegularPayment' and @placeholder='Enter Payment Amount']"),
        paymentsRemaining = By.id("modelObject_NoPaymentsRemaining"),
        arrearage = By.xpath("//*[@id='modelObject_ArrearageAmount' and @placeholder='Enter Amount']"),
        highlightRegPayment = By.id("modelObject_HighLightRegularPayment"),
        highlightArrearage = By.id("modelObject_HighLightRegularArrearage");
        
    req.navigateTo(nav.navMatter.petition.self, nav.navMatter.petition.executoryContracts);
    
    driver.wait(until.elementLocated(emptyRow));
    
    
    //add
    driver.findElement(newBtn).click();
    
    var party = undefined;
    driver.wait(until.elementLocated(searchBtn));
    driver.findElement(searchBtn).click();
    driver.wait(until.elementLocated(nav.dvxprsPopupFirstRow));
    driver.sleep(1000);
    driver.findElement(nav.dvxprsPopupFirstRow).getText().then(function(name) {
       party = name.trim() 
    });
    driver.findElement(nav.dvxprsPopupFirstRow).click();
    driver.sleep(1000);
    driver.wait(until.elementIsEnabled(driver.findElement(typeOfContract)));
    driver.findElement(By.xpath("//*[@id='modelObject_Type']/option[@value='4']")).click();
    driver.findElement(By.xpath("//*[@id='modelObject_DebtorRelationshipToContract']/option[@value='2']")).click();
    driver.findElement(description).sendKeys('Lease of an Yamaha XTZ660');
    driver.findElement(unknown).click();
    driver.findElement(isInDefault).click();
    driver.findElement(exclude).click();
    
    driver.findElement(planOptions).click();
    driver.wait(until.elementIsVisible(driver.findElement(regularPayment)));
    driver.findElement(regularPayment).sendKeys('500');
    driver.findElement(paymentsRemaining).sendKeys('4');
    driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(saveBtn));
    driver.findElement(highlightRegPayment).click();
    driver.findElement(arrearage).sendKeys('1000');
    driver.findElement(highlightArrearage).click();
    
    driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(saveBtn));
    driver.findElement(saveBtn).click();
    
    driver.wait(until.elementLocated(firstRow)).then(function() {
        driver.sleep(1000);
        var firstRowData = [party, 'Unknown', 'Lease of an Yamaha XTZ660'];
        
        firstRowData.forEach(function(item, i, arr) {
            driver.findElement(By.xpath("//div[starts-with(@id, 'CaseExecutoryContracts_')]//tr[contains(@id, 'DXDataRow0')]/td[" + (i + 2) + "]")).getText().then(function(data) {
                assert.equal(data, firstRowData[i])
            });
        });
    });
    
    
    //update
    driver.findElement(firstRow).click();
    
    driver.wait(until.elementLocated(searchBtn));
    driver.sleep(1000);
    driver.findElement(searchBtn).click();
    driver.sleep(500);
    driver.wait(until.elementLocated(nav.dvxprsPopupSecondRow));
    driver.sleep(1500);
    driver.findElement(nav.dvxprsPopupSecondRow).getText().then(function(name) {
       party = name.trim() 
    });
    driver.findElement(nav.dvxprsPopupSecondRow).click();
    driver.sleep(1500);
    driver.wait(until.elementIsEnabled(driver.findElement(typeOfContract)));
    driver.findElement(By.xpath("//*[@id='modelObject_Type']/option[@value='5']")).click();
    driver.findElement(By.xpath("//*[@id='modelObject_DebtorRelationshipToContract']/option[@value='1']")).click();
    driver.findElement(description).clear();
    driver.findElement(description).sendKeys('My crib');
    driver.findElement(reject).click();
    driver.findElement(isInDefault).click();
    driver.findElement(exclude).click();
    
    driver.findElement(planOptions).click();
    driver.wait(until.elementIsVisible(driver.findElement(regularPayment)));
    driver.findElement(regularPayment).clear();
    driver.findElement(paymentsRemaining).clear();
    driver.findElement(paymentsRemaining).sendKeys('2');
    driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(saveBtn));
    driver.findElement(highlightRegPayment).click();
    driver.findElement(arrearage).clear();
    driver.findElement(highlightArrearage).click();
    
    driver.findElement(saveBtn).click();
    
    driver.wait(until.elementLocated(firstRow)).then(function() {
        driver.sleep(1000);
        var firstRowData = [party, 'Reject', 'My crib'];
        
        firstRowData.forEach(function(item, i, arr) {
            driver.findElement(By.xpath("//div[starts-with(@id, 'CaseExecutoryContracts_')]//tr[contains(@id, 'DXDataRow0')]/td[" + (i + 2) + "]")).getText().then(function(data) {
                assert.equal(data, firstRowData[i])
            });
        });
    });
    
    driver.findElement(By.xpath("//div[starts-with(@id, 'CaseExecutoryContracts_')]//tr[contains(@id, 'DXDataRow0')]//a")).click();
    req.confirmDelete();
    driver.wait(until.elementLocated(emptyRow), 10000);
    
};

module.exports.executoryContracts = executoryContracts;