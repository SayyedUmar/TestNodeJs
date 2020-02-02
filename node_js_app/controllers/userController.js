"use strict";

const helper = require('../helpers/commonHelper')
const userModel = require('../models/userModel');

exports.getUserByID = async (req, res) => {
    if (req.params.id instanceof String) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid user_id"))
    }
    let user = await userModel.getUserById(req.params.id);
    let res1 = helper.responseFormat();
    res1.data = user;
    return res.json(res1);
};

exports.getUserCount = async (req, res) => {
    let user = await userModel.getUserCount();
    let res1 = helper.responseFormat();
    res1.data = user;
    return res.json(res1);
};




