import { addRecentUser, getUser } from "~/server/utils/users";
import type { User } from "~/types/user";

export default defineEventHandler(async (event) => {

    const id = getRouterParam(event, 'id');
    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        })
    }
    // const result = await $fetch<Record<string, any>>('https://jsonplaceholder.typicode.com/users/' + id);

    // return {
    //     id: result.id,
    //     name: result.name,
    //     username: result.username,
    //     email: result.email,
    // };
    const user = await getUser(event, id) as User;
    await addRecentUser(user);
    return user;
});