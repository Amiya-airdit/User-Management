const axios = require("axios");
const IDP_USERNAME = "858b5457-bbe5-4fff-9b15-400baf0afe64";
const IDP_PASSWORD = "h:98.ZZl1e[KKCI3ZWfuOOsY26cJebUyCg4";
const IDP_ENDPOINT = "https://a8emy1lrr.accounts.ondemand.com";

module.exports = (srv) => {
  srv.on("READ", "BTPUser", async (req) => {
    try {
      let filters = {}; // For search operation and for update as well of particular/ unique data

      // Extract conditions from the req.query.SELECT.where clause if it exists
      if (req.query.SELECT.where) {
        const whereClause = req.query.SELECT.where;
        for (let i = 0; i < whereClause.length; i += 2) {
          // Check for field and value pairs
          if (whereClause[i].ref && whereClause[i + 1] === "=") {
            const field = whereClause[i].ref[0];
            const value = whereClause[i + 2].val;
            filters[field] = value;
            i++;
          }
        }
      }

      console.log("Filters based on conditions:", filters);

      const base64Credentials = Buffer.from(
        `${IDP_USERNAME}:${IDP_PASSWORD}`,
        "utf-8"
      ).toString("base64");
      const headers = {
        Authorization: `Basic ${base64Credentials}`,
      };

      const response = await axios.get(`${IDP_ENDPOINT}/scim/Users`, {
        headers,
      });

      console.log("Response:", response.data);

      // Adding the count of resources
      response.data.Resources["$count"] = response.data.Resources.length;

      // Mapping the response to the required format
      let users = response.data.Resources.map((user) => {
        const customAttributes =
          user["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"]
            ?.attributes || [];
        const customAttributeMap = customAttributes.reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {});

        return {
          id: user.id, // Resource ID
          userUuid:
            user["urn:ietf:params:scim:schemas:extension:sap:2.0:User"]
              ?.userUuid || "", // UUID
          userName: user.userName || "",
          userType: user.userType || "public",
          firstName: user.name?.givenName || "",
          middleName: user.name?.middleName || "",
          lastName: user.name?.familyName || "",
          emails: user.emails?.[0]?.value || "No Email Provided",
          active: user.active,
          userId:
            user["urn:ietf:params:scim:schemas:extension:sap:2.0:User"]
              ?.userId || "",
          mobileNo:
            user.phoneNumbers?.find((phone) => phone.type === "mobile")
              ?.value || "",
          mailVerified:
            user["urn:ietf:params:scim:schemas:extension:sap:2.0:User"]
              ?.mailVerified || false,
          AdminType: customAttributeMap.customAttribute1 || "",
          Account: customAttributeMap.customAttribute2 || "",
        };
      });

      // Apply filters to the users array
      users = users.filter((user) => {
        return Object.keys(filters).every((key) => {
          return user[key] && user[key].toString() === filters[key].toString();
        });
      });

      users["$count"] = users.length;

      console.log("Filtered Users:", users);
      return users;
    } catch (err) {
      console.error("Error fetching data:", err.message);
      req.reject(500, "Failed to fetch users");
    }
  });

  srv.on("CREATE", "BTPUser", async (req) => {
    try {
      const {
        userName,
        firstName,
        middleName,
        lastName,
        emails,
        mobileNo,
        AdminType,
        Account,
      } = req.data;
      const userData = {
        schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
        userName,
        name: {
          givenName: firstName,
          middleName: middleName,
          familyName: lastName,
        },
        emails: [{ value: emails, type: "work", primary: true }],
        active: true,
        phoneNumbers: [{ value: mobileNo, type: "mobile" }],
        "urn:sap:cloud:scim:schemas:extension:custom:2.0:User": {
          attributes: [
            {
              name: "customAttribute1",
              value: AdminType,
            },
            {
              name: "customAttribute2",
              value: Account,
            },
          ],
        },
      };
      console.log(userData);
      const base64Credentials = Buffer.from(
        `${IDP_USERNAME}:${IDP_PASSWORD}`,
        "utf-8"
      ).toString("base64");
      const headers = {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/scim+json",
      };

      const response = await axios.post(
        `${IDP_ENDPOINT}/service/scim/Users`,
        userData,
        { headers }
      );
      console.log("User created successfully:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error creating user:", err.message);
      req.reject(500, "Failed to create user");
    }
  });

  srv.on("PUT", "BTPUser", async (req) => {
    try {
      const { userName, emails, firstName, middleName, lastName, AdminType, Account,mobileNo } = req.data;
      const id = req.params[0].id;
      console.log("Data received:", id, userName, emails);
 
      const base64Credentials = Buffer.from(
        `${IDP_USERNAME}:${IDP_PASSWORD}`,
        "utf-8"
      ).toString("base64");
 
      const headers = {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/scim+json",
      };
 
      const updateData = {
        schemas: [
          "urn:ietf:params:scim:schemas:core:2.0:User",
          "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
          "urn:sap:cloud:scim:schemas:extension:custom:2.0:User",
        ],
        userName: userName,
        emails: [
          {
            value: emails,
          },
        ],
        name: {
 
          "givenName": firstName,
 
          "familyName": lastName,
 
          "middleName": middleName
 
        },
        phoneNumbers:[{
          "type":"mobile",
          "value":mobileNo
        }],
        "urn:sap:cloud:scim:schemas:extension:custom:2.0:User":
 
        {
   
           "attributes":
   
           [
   
              {
   
              "name": "customAttribute1",
   
              "value": AdminType
   
              },
   
              {
   
              "name": "customAttribute2",
   
              "value": Account
   
             }
   
          ]
   
       }
      };
      const response = await axios.put(
        `${IDP_ENDPOINT}/scim/Users/${id}`,
        updateData,
        { headers }
      );
 
      console.log("User updated successfully:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error in processing UpdateBTPUsers request:", err);
      throw err;
    }
  });
 

  srv.on("DELETE", "BTPUser", async (req) => {
    try {
      const { id } = req.params[0];
      const base64Credentials = Buffer.from(
        `${IDP_USERNAME}:${IDP_PASSWORD}`,
        "utf-8"
      ).toString("base64");
      const headers = {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/scim+json",
      };

      await axios.delete(`${IDP_ENDPOINT}/scim/Users/${id}`, {
        headers: headers,
      });
      console.log(`User ${id} deleted successfully`);
      return { message: `User ${id} deleted successfully` };
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  });

  srv.on("CREATE", "Groups", async (req) => {
    try {
      const { groupName } = req.data;
      console.log(
        req.data,
        "Incoming request data----------------------------"
      );
      const groupData = {
        schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"],
        displayName: groupName,
      };
      console.log(groupData);
      const base64Credentials = Buffer.from(
        `${IDP_USERNAME}:${IDP_PASSWORD}`,
        "utf-8"
      ).toString("base64");
      const headers = {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/scim+json",
      };

      const response = await axios.post(
        `${IDP_ENDPOINT}/scim/Groups`,
        groupData,
        { headers }
      );

      console.log("Group created successfully:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error creating group:", err.message);
      req.reject(500, "Failed to create group");
    }
  });

  srv.on("READ", "Groups", async (req) => {
    try {
      const base64Credentials = Buffer.from(
        `${IDP_USERNAME}:${IDP_PASSWORD}`,
        "utf-8"
      ).toString("base64");
      const headers = {
        Authorization: `Basic ${base64Credentials}`,
      };

      // Make the GET request to the SCIM API for groups
      const response = await axios.get(`${IDP_ENDPOINT}/scim/Groups`, {
        headers,
      });
      const groups = response.data.Resources.map((group) => ({
        id: group.id,
        groupName: group.displayName,
        description:
          group["urn:ietf:params:scim:schemas:extension:custom:2.0:Group"]
            ?.description || "",
        members:
          group.members?.map((member) => ({ userId: member.value })) || [],
      }));
      // console.log(groups);
      console.log(JSON.stringify(groups, null, 2));
      groups["$count"] = groups.length;
      return groups;
    } catch (err) {
      console.error("Error fetching groups:", err.message);
      req.reject(500, "Failed to fetch groups");
    }
  });

  srv.on("DELETE", "Groups", async (req) => {
    try {
      const { id } = req.data;
      console.log(
        req.data,
        "Incoming delete request id---------------------------"
      );
      const base64Credentials = Buffer.from(
        `${IDP_USERNAME}:${IDP_PASSWORD}`,
        "utf-8"
      ).toString("base64");
      const headers = {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/scim+json",
      };

      const response = await axios.delete(`${IDP_ENDPOINT}/scim/Groups/${id}`, {
        headers,
      });

      console.log(`Group ${id} deleted successfully`);
      return { message: `Group ${id} deleted successfully` };
    } catch (err) {
      console.error("Error deleting group:", err.message);
      req.reject(500, "Failed to delete group");
    }
  });

  srv.on("PUT", "Groups", async (req) => {
    try {
      const { id, groupName, members } = req.data;

      console.log("Data received for group update:", id, groupName, members);

      const base64Credentials = Buffer.from(
        `${IDP_USERNAME}:${IDP_PASSWORD}`,
        "utf-8"
      ).toString("base64");

      const headers = {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/scim+json",
      };

      const updateData = {
        schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"],
        id: id,
        displayName: groupName,
        members: members.map((member) => ({
          value: member.value,
          type: "MemberRef",
        })),
      };

      console.log(updateData, "updatedData---------------------");
      const response = await axios.put(
        `${IDP_ENDPOINT}/scim/Groups/${id}`,
        updateData,
        { headers }
      );

      console.log("Group updated successfully:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error in processing UpdateBTPGroups request:", err);
      throw err;
    }
  });
};
