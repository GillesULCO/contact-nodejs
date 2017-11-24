const {Given, Then, When} = require('cucumber');
const assert = require('assert');

let checkList = function(browser){
    const firstnames = browser.queryAll('tbody > tr:nth-child(n+2) > #cellFirstName');
    const lastnames = browser.queryAll('tbody > tr:nth-child(n+2) > #cellLastName');
    const phones = browser.queryAll('tbody > tr:nth-child(n+2) > #cellPhones');
    const mails = browser.queryAll('tbody > tr:nth-child(n+2) > #cellMails');
    const c = browser.tabs.current.Contact;
    const iterator = c.Contacts.instance().iterator();
    let count = 0;
    while (iterator.hasNext()) {
        const firstname = firstnames[count].innerHTML;
        const lastname = lastnames[count].innerHTML;
        const phone = phones[count].innerHTML;
        const mail = mails[count].innerHTML;

        let line = iterator.next();
        let lineMail = "";
        if(line.mails()[0] !== null && line.mails()[0] !== undefined) {
            lineMail = line.mails()[0].address() + "[PRO]";
        }
        if(line.mails()[1] !== null && line.mails()[1] !== undefined) {
            lineMail += "/" + line.mails()[1].address() + "[PERSO]";
        }

        let linePhone ="";
        if(line.phones()[0] !== null && line.phones()[0] !== undefined) {
            linePhone = line.phones()[0].number() + "[PRO][MOBILE]";
        }
        if(line.phones()[1] !== null && line.phones()[1] !== undefined) {
            linePhone += "/" + line.phones()[1].number() + "[PRO][PHONE]";
        }

        assert.ok(firstname === line.firstName() && lastname === line.lastName());
        assert.ok(phone === linePhone);
        assert.ok(mail === lineMail);
        count++;
    }

};

Given(/^The contact list is display$/, function (callback) {
    this.browser.visit("http://localhost:3000/", (err) => {
        if (err) throw err;
        assert.ok(this.browser.success);

        checkList(this.browser);

        callback();
    });
});

When(/^User clicks on remove button of the first contact$/, function (callback) {
    this.browser.visit("http://localhost:3000/", (err) => {
        if (err) throw err;
        assert.ok(this.browser.success);
        let delete_btn = this.browser.query("#contacts table tr:nth-child(2) a:first-child");
        delete_btn.click();
        callback();
    });
});

Then(/^The first contact is removed$/, function (callback) {
        checkList(this.browser);
        callback();
});
