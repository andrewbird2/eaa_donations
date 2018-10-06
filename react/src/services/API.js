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

