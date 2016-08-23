var req = require('../commonFunctions.js'),
    nav = require('../navigation.js'),
    jur = require('../jurisdictions.js'),
    test = require('../testdata.js');

var webdriver = req.webdriver,
    driver = req.driver,
    By = req.By,
    until = req.until;

var assert = req.assert,
    fs = req.fs;
    
req.catchUncaughtExceptions();

var realProperty = function() {
    
    var firstRow = By.xpath("//div[starts-with(@id, 'realproperty')]//tr[contains(@id, 'DXDataRow0')]"),
        secondRow = By.xpath("//div[starts-with(@id, 'realproperty')]//tr[contains(@id, 'DXDataRow1')]"),
        emptyRow = By.xpath("//div[starts-with(@id, 'realproperty')]//tr[contains(@id, 'DXEmptyRow')]"),
        newBtn = By.xpath("//div[starts-with(@id, 'realproperty')]//a[@id='newAssetAnchor']"),
        saveAndCloseBtn = By.xpath("//div[starts-with(@id, 'realproperty')]//button[@type='submit' and @data-role-action='close']"),
        saveBtn = By.xpath("//div[starts-with(@id, 'realproperty')]//button[@type='submit' and @data-role-action='save']");
        
    var zipInput = By.id('Asset_Address_Zip'),
        zipSrchBtn = By.xpath("//button[(preceding-sibling::input[@id='Asset_Address_Zip'])]"),
        streetInput = By.id('Asset_Address_Street1'),
        lineInput = By.id('Asset_Address_Street2'),
        titleInput = By.id('Asset_Address_Title'),
        doNotMailCheckbox = By.id('Asset_Address_DoNotContact');
        
    var valueInput = By.xpath("//*[@id='Asset_Value' and @data-pe-role='currency']"),
        sourceOfValueInput = By.id('Asset_ValueSource'),
        dateAcquiredInput = By.id('Asset_AcquiredOn'),
        assetSurrCheckbox = By.id('IsSurrendered'),
        //ownershipInputOne = By.xpath("//div[@class='row debtor1-row']//input[starts-with(@id, 'TextBox_') and @data-pe-role='percentage']"),
        //ownershipInputTwo = By.xpath("//div[@id='debtor2']//input[starts-with(@id, 'TextBox_') and @data-pe-role='percentage']"),
        //ownershipValueOne = By.xpath("//div[@class='row debtor1-row']//h2[@data-pe-id='value']"),
        //ownershipValueTwo = By.xpath("//div[@id='debtor2']//h2[@data-pe-id='value']"),
        otherOwnerLookup = By.xpath("//button[@class='btn-search'][contains(@data-pe-dialog, '/Entity/MultiLookup')]"),
        stateExemptionsBtn = By.xpath("//button[@class='btn-search'][contains(@data-pe-dialog, '/AssetExemptions/MultiLookup')]");
        //stateExemptionsField = By.xpath("//*[starts-with(@id, 'RealPropertyAssetEditor')]//input[@id='lookup']");
        
    var singleHomeCheckbox = By.xpath("//input[(following-sibling::span[@title='Single-family home'])]"),
        condominiumCheckbox = By.xpath("//input[(following-sibling::span[@title='Condominium or cooperative'])]"),
        landCheckbox = By.xpath("//input[(following-sibling::span[@title='Land'])]"),
        timeshareCheckbox = By.xpath("//input[(following-sibling::span[@title='Timeshare'])]"),
        duplexCheckbox = By.xpath("//input[(following-sibling::span[@title='Duplex or multi-unit building'])]"),
        manufMobHomeCheckbox = By.xpath("//input[(following-sibling::span[@title='Manufactured or mobile home'])]"),
        investmentCheckbox = By.xpath("//input[(following-sibling::span[@title='Investment property'])]"),
        otherCheckbox = By.xpath("//input[(following-sibling::span[@title='Other'])]"),
        otherPropTypeInput = By.id('Asset_AdditionalDetails'),
        communPropYesCheckbox = By.xpath("//*[@id='Asset_IsCommunityProperty' and @value='True']"),
        //communPropNoCheckbox = By.xpath("//*[@id='Asset_IsCommunityProperty' and @value='False']"),
        natOfIntInput = By.id('NatureOfInterest'),
        otherInfoInput = By.id('Asset_Description');
        
    req.navigateTo(nav.navMatter.petition.self, nav.navMatter.petition.property.self, nav.navMatter.petition.property.realProperty);
    
    driver.wait(until.elementLocated(emptyRow), 5000).thenCatch(function() {
            console.log('Real property had some entries!')
            driver.findElements(By.xpath("//div[starts-with(@id, 'realproperty')]//table[contains(@id, 'DXMainTable')]//tr[contains(@id, 'DXDataRow')]")).then(function(entries) {
                for (var i = 1; i <= entries.length; i++) {
                    new req.webdriver.ActionSequence(driver).
                        mouseMove(driver.findElement(By.xpath("//div[starts-with(@id, 'realproperty')]//table[contains(@id, 'DXMainTable')]//tr[contains(@id, 'DXDataRow')][" + i + "]"))).
                        click(driver.findElement(By.xpath("//div[starts-with(@id, 'realproperty')]//table[contains(@id, 'DXMainTable')]//tr[contains(@id, 'DXDataRow')][1]//a"))).
                        perform();
                    req.confirmDelete();
                    driver.sleep(1000);  
                }
            })
        });
    
    //ADD THE FIRST ENTRY
    driver.findElement(newBtn).click();
    
    //waiting for three sections
    driver.wait(until.elementLocated(natOfIntInput));
    driver.wait(until.elementLocated(valueInput));
    driver.wait(until.elementLocated(zipInput));
    
    //asset description
    driver.findElement(By.xpath("//input[@id='Asset_IsPrincipalResidence'][@value='True']")).click();
    req.waitForAddressZip();
    
    //asset value
    driver.findElement(valueInput).sendKeys('200000');
    driver.findElement(sourceOfValueInput).sendKeys('Expensive Estimates LTD');
    driver.findElement(dateAcquiredInput).sendKeys('Sep 02, 1996');

    driver.findElement(otherOwnerLookup).click();
    driver.wait(until.elementLocated(nav.dvxprsPopupFirstRow), 10000);
    driver.sleep(2000);

    driver.findElement(nav.dvxprsPopupFirstRow).click();
    driver.findElement(nav.dvxprsSaveAndCloseBtn).click();
    
    driver.sleep(1000);
    driver.wait(until.elementIsVisible(driver.findElement(stateExemptionsBtn)), 10000);

    driver.findElement(stateExemptionsBtn).click();
    driver.wait(until.elementLocated(nav.dvxprsPopupFirstRow), 10000);
    driver.sleep(1000);
    driver.findElement(nav.dvxprsPopupFirstRow).click();
    driver.findElement(nav.dvxprsSaveAndCloseBtn).click();
    
    //asset details
    driver.wait(until.elementIsEnabled(driver.findElement(singleHomeCheckbox)));
    driver.sleep(1000);
    driver.findElement(singleHomeCheckbox).click();
    driver.findElement(communPropYesCheckbox).click();
    driver.findElement(natOfIntInput).sendKeys('Homestead');
    driver.findElement(otherInfoInput).sendKeys('It has a nice lawn');
    driver.findElement(saveAndCloseBtn).click();
    
    driver.wait(until.elementLocated(firstRow), 10000);
    
    //ADD THE SECOND ENTRY
    driver.findElement(newBtn).click();
    
    driver.wait(until.elementLocated(natOfIntInput));
    driver.wait(until.elementLocated(valueInput));
    driver.wait(until.elementLocated(zipInput));
    
    //asset description
    driver.findElement(zipInput).sendKeys('90220');
    driver.findElement(zipSrchBtn).click();
    req.waitForAddressZip();
    driver.findElement(streetInput).sendKeys('Street');
    driver.findElement(titleInput).sendKeys('My second home');
    driver.findElement(lineInput).sendKeys('LineLine');
    driver.findElement(doNotMailCheckbox).click();
    driver.findElement(natOfIntInput).sendKeys('Fee Simple');
    driver.findElement(condominiumCheckbox).click();
    driver.findElement(landCheckbox).click();
    driver.findElement(timeshareCheckbox).click();
    driver.findElement(duplexCheckbox).click();
    driver.findElement(manufMobHomeCheckbox).click();
    driver.findElement(investmentCheckbox).click();
    driver.findElement(otherCheckbox).click();
    driver.wait(until.elementIsEnabled(driver.findElement(otherPropTypeInput)));
    driver.findElement(otherPropTypeInput).sendKeys('garage');
    driver.findElement(saveAndCloseBtn).click();
    
    driver.wait(until.elementLocated(secondRow), 10000).then(function() {
        //console.log('The second real property added OK');
        var secondRowElement = driver.findElement(secondRow); //nvm, just trying out
        secondRowElement.click();
        
        driver.wait(until.elementLocated(natOfIntInput));
        driver.wait(until.elementLocated(valueInput));
        driver.wait(until.elementLocated(zipInput));
        
        driver.findElement(By.id('Debtor2Selected')).click();
        driver.findElement(saveBtn).click();
        driver.sleep(2000);
        //driver.wait(until.elementIsVisible(secondRowElement), 10000);
        
        //delete
        driver.findElement(By.xpath("//div[starts-with(@id, 'realproperty')]//tr[contains(@id, 'DXDataRow1')]//a")).click();
        req.confirmDelete();
        driver.sleep(1000);
        driver.wait(until.stalenessOf(secondRowElement), 10000);
           
    });
    
    
};


var personalProperty = function() {
    
    var firstRow = By.xpath("//div[starts-with(@id, 'personalproperty')]//tr[contains(@id, 'DXDataRow0')]"),
        secondRow = By.xpath("//div[starts-with(@id, 'personalproperty')]//tr[contains(@id, 'DXDataRow1')]"),
        emptyRow = By.xpath("//div[starts-with(@id, 'personalproperty')]//tr[contains(@id, 'DXEmptyRow')]"),
        newBtn = By.xpath("//div[starts-with(@id, 'personalproperty')]//a[@id='newAssetAnchor']"),
        saveAndCloseBtn = By.xpath("//div[starts-with(@id, 'personalproperty')]//button[@type='submit' and @data-role-action='close']"),
        saveBtn = By.xpath("//div[starts-with(@id, 'personalproperty')]//button[@type='submit' and @data-role-action='save']");
        
    var motorVehicleLink = By.xpath("//a[@data-value='25']"),
        checkingAccountsLink = By.xpath("//a[@data-value='2']");
        //householdGoodsLink = By.xpath("//a[@data-value='4']"),
        //clothesLink = By.xpath("//a[@data-value='38']");
        
    var //categorySelect = By.id('Asset_CategoryId'),
        descriptionInput = By.id('Asset_Description'),
        makeInput = By.name('vehicle.Make'),
        modelInput = By.name('vehicle.Model'),
        yearInput = By.name('vehicle.Year'),
        mileageInput = By.name('vehicle.Mileage'),
        valueInput = By.xpath("//*[@id='Asset_Value' and @data-pe-role='currency']"),
        sourceOfValueInput = By.id('Asset_ValueSource'),
        dateAcquiredInput = By.id('Asset_AcquiredOn'),
        assetSurrCheckbox = By.id('IsSurrendered'),
        //ownershipInputOne = By.xpath("//div[@class='row debtor1-row']//input[starts-with(@id, 'TextBox_') and @data-pe-role='percentage']"),
        //ownershipInputTwo = By.xpath("//div[@id='debtor2']//input[starts-with(@id, 'TextBox_') and @data-pe-role='percentage']"),
        //ownershipValueOne = By.xpath("//div[@class='row debtor1-row']//h2[@data-pe-id='value']"),
        //ownershipValueTwo = By.xpath("//div[@id='debtor2']//h2[@data-pe-id='value']"),
        otherOwnerLookup = By.xpath("//article[starts-with(@id, 'PersonalPropertyAssetEditor')]//button[@class='btn-search'][contains(@data-pe-dialog, '/Entity/MultiLookup')]"),
        stateExemptionsBtn = By.xpath("//article[starts-with(@id, 'PersonalPropertyAssetEditor')]//button[@class='btn-search'][contains(@data-pe-dialog, '/AssetExemptions/MultiLookup')]");
        //stateExemptionsField = By.xpath("//*[starts-with(@id, 'PersonalPropertyAssetEditor')]//input[@id='lookup']");
    
    req.navigateTo(nav.navMatter.petition.self, nav.navMatter.petition.property.self, nav.navMatter.petition.property.personalProperty);
    
    driver.wait(until.elementLocated(emptyRow), 5000).thenCatch(function() {
            console.log('Personal property had some entries!')
            driver.findElements(By.xpath("//div[starts-with(@id, 'personalproperty')]//table[contains(@id, 'DXMainTable')]//tr[contains(@id, 'DXDataRow')]")).then(function(entries) {
                for (var i = 1; i <= entries.length; i++) {
                    new req.webdriver.ActionSequence(driver).
                        mouseMove(driver.findElement(By.xpath("//div[starts-with(@id, 'personalproperty')]//table[contains(@id, 'DXMainTable')]//tr[contains(@id, 'DXDataRow')][" + i + "]"))).
                        click(driver.findElement(By.xpath("//div[starts-with(@id, 'personalproperty')]//table[contains(@id, 'DXMainTable')]//tr[contains(@id, 'DXDataRow')][1]//a"))).
                        perform();
                    req.confirmDelete();
                    driver.sleep(1000);  
                }
            })
        });
    
    //add the first entry
    driver.findElement(newBtn).click();
    driver.wait(until.elementLocated(motorVehicleLink));
    driver.findElement(motorVehicleLink).click();
    driver.wait(until.elementLocated(makeInput));
    
    driver.findElement(descriptionInput).sendKeys('Nice motorcycle');
    driver.findElement(makeInput).sendKeys('Yamaha');
    driver.findElement(modelInput).sendKeys('XTZ660');
    driver.findElement(yearInput).sendKeys('2008');
    driver.findElement(mileageInput).sendKeys('21000');
    
    driver.findElement(valueInput).sendKeys('10000');
    driver.findElement(sourceOfValueInput).sendKeys('Expensive Estimates LTD');
    driver.findElement(dateAcquiredInput).sendKeys('Sep 02, 1996');

    driver.findElement(otherOwnerLookup).click();
    driver.wait(until.elementLocated(nav.dvxprsPopupFirstRow));
    driver.sleep(1000);
    driver.findElement(nav.dvxprsPopupFirstRow).click();
    driver.findElement(nav.dvxprsSaveAndCloseBtn).click();

    driver.wait(until.elementIsVisible(driver.findElement(stateExemptionsBtn)), 10000);

    driver.wait(until.elementIsEnabled(driver.findElement(stateExemptionsBtn)), 10000);
    driver.findElement(stateExemptionsBtn).click();
    driver.wait(until.elementLocated(nav.dvxprsPopupFirstRow), 10000);
    driver.sleep(1000);
    driver.findElement(nav.dvxprsPopupFirstRow).click();
    driver.findElement(nav.dvxprsSaveAndCloseBtn).click();
    
    driver.wait(until.elementIsEnabled(driver.findElement(saveAndCloseBtn)));
    driver.sleep(1000);
    driver.findElement(saveAndCloseBtn).click();
    
    driver.wait(until.elementLocated(firstRow), 10000).thenCatch(function(err) {
        console.log('The first personal property was not added FAIL ' + err.message)
    });
    
    //ADD THE SECOND ENTRY
    driver.findElement(newBtn).click();
    driver.wait(until.elementLocated(checkingAccountsLink));
    driver.findElement(checkingAccountsLink).click();
    driver.wait(until.elementLocated(descriptionInput));
    driver.findElement(descriptionInput).sendKeys('Tons of money');
    driver.findElement(saveAndCloseBtn).click();
    
    driver.wait(until.elementLocated(secondRow)).then(function() {
        
        //console.log('The second personal property added OK')
        
        //update the second entry
        //driver.findElement(secondRow).click();
        
        var secondRowElement = driver.findElement(secondRow); //nvm, just trying out
        secondRowElement.click();
        
        driver.wait(until.elementLocated(checkingAccountsLink));
        driver.findElement(descriptionInput).clear();
        driver.findElement(descriptionInput).sendKeys('Delete me');
        driver.findElement(saveBtn).click();
        driver.sleep(2000);
        //driver.wait(until.elementIsEnabled(driver.findElement(secondRow)));
        
            
            //delete
        driver.findElement(By.xpath("//div[starts-with(@id, 'personalproperty')]//tr[contains(@id, 'DXDataRow1')]//a")).click();
        req.confirmDelete();
        //driver.sleep(1000);
        driver.wait(until.stalenessOf(secondRowElement), 5000);
        
        
    }, function(err) {
        console.log('The second personal property was not added FAIL ' + err.message)
    });
    
    
};


var assetExemptions = function() {
    
    var firstRow = By.xpath("//article[@id='assetsWithExemptions']//tr[contains(@id, 'DXDataRow0')]"),
        addExemptionBtn = By.xpath("//article[@id='assetsWithExemptions']//tr[contains(@id, 'DXDataRow0')]//a[@data-hint='Add State Exemptions']"),
        deleteBtn = By.xpath("//article[@id='assetsWithExemptions']//tr[contains(@id, 'DXDataRow0')]//div[starts-with(@class, 'row')][2]//a[@title='Delete']");
    
    req.navigateTo(nav.navMatter.petition.self, nav.navMatter.petition.property.self, nav.navMatter.petition.property.assetExemptions);
    
    driver.wait(until.elementLocated(firstRow), 10000);
    driver.findElement(addExemptionBtn).click();
    driver.wait(until.elementLocated(nav.dvxprsExemptionsFirstRow), 10000);
    driver.sleep(1000);
    driver.findElement(nav.dvxprsExemptionsFirstRow).click();
    driver.findElement(nav.dvxprsExemptionsAddBtn).click();
    driver.wait(until.elementLocated(deleteBtn), 2000).then(function() {
        driver.findElement(deleteBtn).click();
        driver.sleep(1000);
        driver.findElement(deleteBtn).then(function() {
            console.log('Exemption was not deleted FAIL')
        }, function(err) {
            //Exemption deleted
        });
    
    }, function(err) {
        console.log('Exemption was not added FAIL')
    });
    
};



var exemptionCalculator = function() {
    
    driver.wait(until.elementLocated(By.xpath("//button[@data-pe-role='toggleExemptionCalculator']")), 10000);
    driver.findElement(By.xpath("//button[@data-pe-role='toggleExemptionCalculator']")).click();
    
    driver.wait(until.elementLocated(By.xpath("//input[@id='useStateExemptions']")), 10000);
    driver.findElement(By.xpath("//button[@data-pe-role='toggle-exemption-settings']")).click();

    driver.wait(until.elementLocated(By.xpath("//*[@id='btnLatestExemptions']/button")));
    driver.findElement(By.xpath("//*[@id='btnLatestExemptions']/button")).click();
    var latestExemptionsBtnEl = driver.findElement(By.xpath("//*[@id='btnLatestExemptions']/button"));
    driver.wait(until.elementLocated(By.id('messageDialog2')), 5000);
    driver.findElement(By.xpath("//div[starts-with(@id, 'CaseProperty_')]//form[starts-with(@id, 'AdditionalDetailsBankruptcy_')]//button[text()='Save']")).click();
    driver.wait(until.stalenessOf(latestExemptionsBtnEl), 10000);
    driver.findElement(By.xpath("//span[@data-pe-role='close-exemption-calculator']")).click();
    
};

module.exports = {
    realProperty: realProperty,
    personalProperty: personalProperty,
    assetExemptions: assetExemptions,
    exemptionCalculator: exemptionCalculator
};