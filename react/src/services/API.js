import React from "react";

export default class APIService {
    getCharities() {
        return fetch('/donations/partner_charities').then(function (response) {
            return response.json();
        });
    }

    getReferralSources() {
        return fetch('/donations/referral_sources').then(function (response) {
            return response.json();
        });
    }

    submit(raw_data) {
        let data = JSON.parse(JSON.stringify(raw_data));
        if (!data.allocate) {
            data.allocation['unallocated'] = data.amount;
        }
        if (data.contribute) {
            data.allocation['eaa'] = data.contribution;
        }

        Object.keys(data.allocation).map((key, i) => {
            data['form-' + i + '-id'] = null; // This tells Django that the object doesn't already exist
            data['form-' + i + '-partner_charity'] = key;
            data['form-' + i + '-amount'] = data.allocation[key];
        });

        data['form-TOTAL_FORMS'] = Object.keys(data.allocation).length;
        data['form-INITIAL_FORMS'] = 0;

        return fetch('/donations/pledge/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(function (response) {
            return response.json();
        });
    }
}

