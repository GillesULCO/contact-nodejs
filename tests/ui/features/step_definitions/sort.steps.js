const {Given, Then, When} = require('cucumber');
const assert = require('assert');

Given(/^The unsorted contact list is display$/, function (callback) {
    this.browser.visit("http://localhost:3000/", (err) => {
        if (err) throw err;
        assert.ok(this.browser.success);

        const firstnames = this.browser.queryAll('tbody > tr:nth-child(n+2) > #cellFirstName');
        const lastnames = this.browser.queryAll('tbody > tr:nth-child(n+2) > #cellLastName');
        const phones = this.browser.queryAll('tbody > tr:nth-child(n+2) > #cellPhones');
        const mails = this.browser.queryAll('tbody > tr:nth-child(n+2) > #cellMails');
        const c = this.browser.tabs.current.Contact;
        const iterator = c.Contacts.instance().iterator();
        let count = 0;
        while (iterator.hasNext()) {
            const firstname = firstnames[count].innerHTML;
            const lastname = lastnames[count].innerHTML;
            const phone = phones[count].innerHTML;
            const mail = mails[count].innerHTML;

            let line = iterator.next();
            let lineMail = "";
            if (line.mails()[0] !== null && line.mails()[0] !== undefined) {
                lineMail = line.mails()[0].address() + "[PRO]";
            }
            if (line.mails()[1] !== null && line.mails()[1] !== undefined) {
                lineMail += "/" + line.mails()[1].address() + "[PERSO]";
            }

            let linePhone = "";
            if (line.phones()[0] !== null && line.phones()[0] !== undefined) {
                linePhone = line.phones()[0].number() + "[PRO][MOBILE]";
            }
            if (line.phones()[1] !== null && line.phones()[1] !== undefined) {
                linePhone += "/" + line.phones()[1].number() + "[PRO][PHONE]";
            }

            assert.ok(firstname === line.firstName() && lastname === line.lastName());
            assert.ok(phone === linePhone);
            assert.ok(mail === lineMail);
            count++;
        }

        callback();
    });
});

When(/^User clicks on sort button$/, function (callback) {
    this.browser.visit("http://localhost:3000/", (err) => {
        if (err) throw err;
        assert.ok(this.browser.success);
        let sort_btn = this.browser.query("#contacts #button_sort");
        sort_btn.click();
        callback();
    });
});

Then(/The contact list is sorted$/, function (callback) {
        const lastNamesRead = [];
        const iterator = this.browser.tabs.current.Contact.Contacts.instance().iterator();
        while (iterator.hasNext()) {
            let line = iterator.next();
            lastNamesRead.push(line.lastName());
        }
        lastNamesRead.sort();

        let lastNames = this.browser.queryAll("#contacts > table > tbody > tr:nth-child(n+1) > td#cellLastName");
        let count = 0;
        for (let indexName=0;indexName<lastNames.length;indexName++){
            assert.ok(lastNames[indexName].innerHTML === lastNamesRead[count++]);
        }
        callback();
});