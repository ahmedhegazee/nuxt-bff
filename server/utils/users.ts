import type { H3Event } from "h3";
import { User } from "~/types/user";
export const getUser = defineCachedFunction(async (_event: H3Event, id: string) => {
    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        })
    }
    const result = await $fetch<Record<string, any>>('https://jsonplaceholder.typicode.com/users/' + id);

    return {
        id: result.id,
        name: result.name,
        username: result.username,
        email: result.email,
    } as User;
}, {
    maxAge: 1000 * 60 * 60,
    swr: false,
});
const KEY = "recent-users";
export const getRecentUsers = async (): Promise<User[]> => {
    const users = await useStorage().getItem<User[]>(KEY) ?? [];
    return users;
}

const RECENT_USERS_LIMIT = 3;
export const addRecentUser = async (user: User): Promise<User[]> => {
    const users = await getRecentUsers();
    if (users.find(u => u.id === user.id))
        return users;
    users.unshift(user);
    if (users.length > RECENT_USERS_LIMIT) {
        users.pop();
    }
    //save users to storage
    await useStorage().setItem(KEY, users);
    return users;
}