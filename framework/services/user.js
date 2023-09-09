import supertest from 'supertest';

import config from '../config';
const {url} = config

let token = ''

const user = {
    login: (payload) => {
        return supertest(url)
            .post('/Account/AccountV1UserPost')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(payload)
    },

    async getAuthToken(){
        const payload = config.credentials
        const res = await this.login(payload)
        return res.body.token
    },
};

export default user





















/*//2й вариант 
async getAuthTokenInCache(){
    token = await this.getAuthToken;
    return token;
},

user: (token) => {
    return supertest(url)
        .get('api/v1/user')
        .set('Accept', 'application/json')
        .set('authorization', `Basic ${token}`)
}
}*/