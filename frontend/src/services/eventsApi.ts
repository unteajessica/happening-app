//const API_MODE: string = "rest";
const API_MODE: string = "graphql";

import * as restApi from "./eventsApi.rest";
import * as graphqlApi from "./eventsApi.graphql";

const api = API_MODE === "graphql" ? graphqlApi : restApi;

export const fetchEvents = api.fetchEvents;
export const fetchEventsPage = api.fetchEventsPage;
export const fetchEventById = api.fetchEventById;
export const createEventRequest = api.createEventRequest;
export const updateEventRequest = api.updateEventRequest;
export const deleteEventRequest = api.deleteEventRequest;

export const fetchCommentsByEventId = api.fetchCommentsByEventId;
export const createCommentRequest = api.createCommentRequest;
export const deleteCommentRequest = api.deleteCommentRequest;
export const fetchCommentStats = api.fetchCommentStats;

export const fetchCategoryStats = api.fetchCategoryStats;
export const fetchPriceStats = api.fetchPriceStats;

export const startGeneratorRequest = api.startGeneratorRequest;
export const stopGeneratorRequest = api.stopGeneratorRequest;
export const fetchGeneratorStatus = api.fetchGeneratorStatus;

export { API_MODE };