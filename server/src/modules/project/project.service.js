import Project from "../../models/Project.model.js";
import User from "../../models/User.model.js";
import { ApiError } from "../../utils/ApiError.js";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const resolveTeamMembers = async (teamMembers = []) => {
    const identifiers = [
        ...new Set(
            teamMembers
                .map((value) => value?.trim())
                .filter(Boolean)
        ),
    ];

    if (identifiers.length === 0) return [];

    const idInputs = identifiers.filter((value) => objectIdPattern.test(value));
    const emailInputs = identifiers
        .filter((value) => !objectIdPattern.test(value))
        .map((value) => value.toLowerCase());

    const [usersById, usersByEmail] = await Promise.all([
        idInputs.length ? User.find({ _id: { $in: idInputs } }).select('_id') : [],
        emailInputs.length ? User.find({ email: { $in: emailInputs } }).select('_id email') : [],
    ]);

    const foundMemberIds = new Set([
        ...usersById.map((user) => String(user._id)),
        ...usersByEmail.map((user) => String(user._id)),
    ]);

    const foundEmails = new Set(usersByEmail.map((user) => user.email.toLowerCase()));
    const missingEmails = emailInputs.filter((email) => !foundEmails.has(email));
    const missingIds = idInputs.filter((id) => !foundMemberIds.has(id));

    if (missingEmails.length > 0 || missingIds.length > 0) {
        throw new ApiError(
            400,
            `Some team members were not found: ${[...missingEmails, ...missingIds].join(', ')}`
        );
    }

    return [...foundMemberIds];
};

const createProject = async(projectData, ownerId) => {
    const resolvedTeamMembers = await resolveTeamMembers(projectData.teamMembers);

    const project = await Project.create({
        ...projectData,
        teamMembers: resolvedTeamMembers,
        owner: ownerId
    })

    return project
}

const getUserProjects = async (userId, role) => {
    if(role=== 'Admin'){
        return await Project.find({owner: userId})
    } else{
        return await Project.find({teamMembers: userId}).populate('owner', 'name email')
    }
}

export{
    createProject,
    getUserProjects
}
