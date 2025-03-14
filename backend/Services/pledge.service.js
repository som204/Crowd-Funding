import pledgeModel from '../Models/pledge.model.js';

export async function createPledge(pledgeData) {
    try {
        if (!pledgeData) {
            throw new Error("Value is Missing");
        }
        const pledge = await pledgeModel.create(pledgeData);
        return pledge;
    } catch (error) {
        console.log(error)
        throw new Error('Error creating pledge: ' + error.message);
    }
}

export async function getPledgesByProjectId(projectId) {
    try {
        if (!projectId) {
            throw new Error("Project Id is Missing");
        }
        const pledges = await pledgeModel.find({ project_id: projectId });
        return pledges;
    } catch (error) {
        throw new Error('Error fetching pledges: ' + error.message);
    }
}

export async function getPledgesByBackerId(backerId) {
    try {
        if (!backerId) {
            throw new Error("Backer Id is Missing");
        }
        const pledges = await pledgeModel.find({ backer_id: backerId });
        return pledges;
    } catch (error) {
        throw new Error('Error fetching pledges: ' + error.message);
    }
}