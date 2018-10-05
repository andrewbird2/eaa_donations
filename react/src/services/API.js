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

    submit(data) {

        // return fetch('/pledge/', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(pledge_clean)
        // }).then(function (response) {
        //     return response.json();
        // });
    }
}

