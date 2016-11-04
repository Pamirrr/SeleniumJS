var util = require('../src/functions.js'),
    nav = require('../src/navigation.js'),
    jur = require('../src/jurisdictions.js'),
    test = require('../src/testdata.js'),
    sofa = require('./sofa.js');

var webdriver = util.webdriver,
    driver = util.driver,
    By = util.By,
    until = util.until;

var assert = util.assert,
    fs = util.fs;
    
driver.manage().window().maximize();
driver.manage().timeouts().implicitlyWait(2000);

util.catchUncaughtExceptions();


var createAppointment = function() {
    
    var title = By.id('modelObject_Title'),
        location = By.id('modelObject_Location'),
        allDay = By.id('modelObject_AllDay'),
        saveBtn = By.xpath("//*[starts-with(@id, 'CreateEventDetailsSection')]//button[@type='submit']");
        
    driver.wait(until.elementLocated(title));
    driver.findElement(title).getAttribute('value').then(function(name) {
        if (name == '') {
            driver.findElement(title).sendKeys('Test title');
        }
    });
    driver.findElement(By.xpath("//select[@id='OfficeId']/option[1]")).click();
    driver.findElement(location).sendKeys('Nice location');
    driver.findElement(By.xpath("//select[@id='modelObject_TypeId']/option[not(@disabled='') and not(@value='')][1]")).click();
    driver.findElement(allDay).click();
    //
    //reserved for attendees
    //
    driver.sleep(1000);
    driver.findElement(saveBtn).click();
    
};

var contactAppointment = function() {
  
    var appointmentsTab = By.xpath("//div[starts-with(@id, 'entityEventTabs')]//a[text()='Appointments']"),
        newBtn = By.xpath("//div[starts-with(@id, 'appointments_entityEventTabs')]//a[contains(@class, 'gridBtn-new')]"),
        emptyRow = By.xpath("//div[starts-with(@id, 'appointments_entityEventTabs')]//tr[contains(@id, 'DXEmptyRow')]"),
        firstRow = By.xpath("//div[starts-with(@id, 'appointments_entityEventTabs')]//tr[contains(@id, 'DXDataRow0')]");
    
    util.openCreateContact('dashboard', 'person');
    util.createPerson(test.person);

    driver.wait(until.elementLocated(nav.navContact.profile.self));
    driver.findElement(nav.navContact.profile.self).click();
    driver.wait(until.elementLocated(nav.navContact.profile.events));
    driver.sleep(2000);
    driver.findElement(nav.navContact.profile.events).click();
    
    driver.wait(until.elementLocated(appointmentsTab));
    driver.findElement(appointmentsTab).click();
    
    driver.wait(until.elementLocated(newBtn));
    driver.wait(until.elementLocated(emptyRow));
    
    driver.findElement(newBtn).click();
    
    createAppointment();
    
    driver.wait(until.elementLocated(firstRow));
    driver.sleep(1000);
    
    driver.findElement(By.xpath("//div[starts-with(@id, 'appointments_entityEventTabs')]//tr[contains(@id, 'DXDataRow0')]//a")).click();
    util.confirmDelete();
    
    driver.sleep(2000);
    driver.findElement(emptyRow).catch(function() {
        console.log('Contact Appointment was not deleted FAIL')
    });
    
    
    
};


var matterAppointment = function() {
    
    var emptyRow = By.xpath("//div[starts-with(@id, 'CaseViewAppointments_')]//tr[contains(@id, 'DXEmptyRow')]"),
        firstRow = By.xpath("//div[starts-with(@id, 'CaseViewAppointments_')]//tr[contains(@id, 'DXDataRow0')]"),
        newBtn = By.xpath("//div[starts-with(@id, 'CaseViewAppointments_')]//a[contains(@class, 'gridBtn-new')]");
    
    util.openCreateContact('dashboard', 'person');
    util.createPerson(test.person);
    util.createBKmatter(test.matter)
    
    driver.findElement(nav.navMatter.events.self).click();
    driver.wait(until.elementLocated(nav.navMatter.events.appointments));
    driver.findElement(nav.navMatter.events.appointments).click();
    
    driver.wait(until.elementLocated(emptyRow));
    driver.wait(until.elementLocated(newBtn));
    
    driver.findElement(newBtn).click();
    
    createAppointment();
    
    driver.wait(until.elementLocated(firstRow));
    driver.sleep(1000);
    
    driver.findElement(By.xpath("//div[starts-with(@id, 'CaseViewAppointments_')]//tr[contains(@id, 'DXDataRow0')]//a")).click();
    util.confirmDelete();
    
    driver.sleep(2000);
    driver.findElement(emptyRow).catch(function() {
        console.log('Contact Appointment was not deleted FAIL')
    });
    
};


var calendarAppointment = function() {
    
    var newBtn = By.xpath("//div[@id='calendarSection']//a[contains(@class, 'gridBtn-new')]");
        
    
    driver.findElement(nav.navBar.view.self).click();
    driver.wait(until.elementIsEnabled(driver.findElement(nav.navBar.view.calendar)));
    driver.sleep(500);
    driver.findElement(nav.navBar.view.calendar).click();
    
    //add
    driver.wait(until.elementLocated(newBtn));
    driver.wait(until.elementLocated(By.xpath("//div[@id='calendarSection']//div[@id='list_from_till']")));
    driver.sleep(1000);
    
    driver.findElement(newBtn).click();
    
    createAppointment();
    
    driver.wait(until.elementIsVisible(driver.findElement(newBtn)));
    driver.sleep(1000);
    
    //update
    new util.webdriver.ActionSequence(driver).
            mouseMove(driver.findElement(By.xpath("//div[@id='calendarSection']//div[@id='list_from_till']//tr[1]"))).
            click(driver.findElement(By.xpath("//div[@id='calendarSection']//div[@id='list_from_till']//tr[1]//a[@title='Edit']"))).
            perform();
    
    var title = By.id('modelObject_Title');
    driver.wait(until.elementLocated(title));
    driver.findElement(title).clear();
    driver.findElement(title).sendKeys('New title');
    driver.findElement(By.xpath("//*[starts-with(@id, 'UpdateEvent')]//button[@type='submit']")).click();
    
    driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//div[@id='calendarSection']//div[@id='list_from_till']//tr[1]"))));
    driver.sleep(1000);
    
    //delete
    new util.webdriver.ActionSequence(driver).
            mouseMove(driver.findElement(By.xpath("//div[@id='calendarSection']//div[@id='list_from_till']//tr[1]"))).
            click(driver.findElement(By.xpath("//div[@id='calendarSection']//div[@id='list_from_till']//tr[1]//a[@title='Delete']"))).
            perform();
    util.confirmDelete();
    
    
};


driver.manage().window().maximize();
util.authorize(test.env, test.login, test.password);
util.closeTabs();

//'SEE ALL' LINK CHECK
driver.findElement(By.xpath("//div[@id='Events_Tab']//a[contains(@class, 'seeAllBtn')]")).click();
driver.wait(until.elementLocated(By.xpath("//div[@id='calendarSection']//a[contains(@class, 'gridBtn-new')]")), 15000);
driver.wait(until.elementLocated(By.xpath("//table[@data-role='tableFromTill']")), 15000);
driver.sleep(2000);
util.closeTabs();

contactAppointment();
util.closeTabs();

matterAppointment();
util.closeTabs();

calendarAppointment();
util.closeTabs();

util.logOut();