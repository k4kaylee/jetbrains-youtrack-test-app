import { HostAPI, Project } from '../../../@types/globals';

export const fetchProjects = async (host: HostAPI): Promise<Project[]> => {
  try {
    const response: Project[] = await host.fetchYouTrack(`admin/projects`, {
      query: { fields: 'id,name,shortName,leader(name),iconUrl,description' },
    });

    if (Array.isArray(response)) {
      return response;
    }

    throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
  } catch (error) {
     // eslint-disable-next-line no-console
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchFlag = async (host: HostAPI): Promise<boolean> => {
  try {
    const response: { value: boolean; ok: boolean } = await host.fetchApp(`backend/flag`, {});

    if (response?.ok) {
      return response.value;
    }

    return false;
  } catch (error) {
     // eslint-disable-next-line no-console
    console.error('Error fetching flag:', error);
    return false;
  }
};

export const setFlag = async (host: HostAPI, newValue: boolean): Promise<boolean> => {
  try {
    const response: { ok: boolean } = await host.fetchApp(`backend/flag`, {
      method: 'PUT',
      query: { newValue },
    });

    return response?.ok ?? false;
  } catch (error) {
     // eslint-disable-next-line no-console
    console.error('Error setting flag status:', error);
    return false;
  }
};
