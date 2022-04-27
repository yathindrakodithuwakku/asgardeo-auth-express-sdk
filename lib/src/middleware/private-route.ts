/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import express from "express";
import { AsgardeoExpressCore } from "../core";
import { Logger } from "../utils/logger-util";

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.nextFunction) => {
    if (req.cookies.ASGARDEO_SESSION_ID === undefined) {
        Logger.error("No session ID found in the request cookies");
        return res.status(401).send({
            message: "Unauthenticated"
        });
    } else {
        //validate the cookie
        let asgardeoExpressCore: AsgardeoExpressCore = AsgardeoExpressCore.getInstance();
        const isCookieValid = await asgardeoExpressCore.isAuthenticated(req.cookies.ASGARDEO_SESSION_ID);
        if (isCookieValid) {
            return next();
        } else {
            Logger.error("Invalid session ID found in the request cookies");
            return res.status(401).send({
                message: "Invalid session cookie"
            });
        }
    }
};
