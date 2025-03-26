import React, { memo, useCallback, useState, useEffect } from 'react';
import List from '@jetbrains/ring-ui-built/components/list/list';
import { HostAPI, Project } from '../../../@types/globals';
import Loader from '@jetbrains/ring-ui-built/components/loader/loader';
import ContentLayout from '@jetbrains/ring-ui-built/components/content-layout/content-layout'
import Toggle, { Size } from '@jetbrains/ring-ui-built/components/toggle/toggle'
import Heading, { H2 } from '@jetbrains/ring-ui-built/components/heading/heading'
import Button from '@jetbrains/ring-ui-built/components/Button/Button'

interface AppProps {
  host: HostAPI;
}

const AppComponent: React.FunctionComponent<AppProps> = ({ host }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    try {

      const response: Project[] = await host.fetchYouTrack(`admin/projects`, { query: { fields: 'id,name,shortName,leader(name),iconUrl,description' } });

      if (Array.isArray(response)) {
        // console.log('is Array!', response)
        setProjects(response);
        return;
      }

      throw new Error(`Not array. Response value: ${projects}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching projects:', error);
    }
  }, [host, projects]);

  const fetchFlag = useCallback(async () => {
    try {
      const response: { value: boolean } = await host.fetchApp(`backend/flag`, {});

      // eslint-disable-next-line no-console
      console.log(response);

      setIsToggled(response?.value);

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching flag:', error);
    }
  }, [host,]);

  const setFlag = async (newValue: boolean) => {
    try {
      const response: boolean = await host.fetchApp(`backend/flag`, { method: 'PUT', query: { newValue: newValue } });
      setIsToggled(newValue);

      // eslint-disable-next-line no-console
      console.log(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error setting flag status:', error);
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects]);

  useEffect(() => {
    fetchFlag();
  }, [fetchFlag])

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("isToggled: ", isToggled);
  }, [isToggled])

  return (
    <div className="widget" >
      {/* Task 1, Project List */}
      <ContentLayout>
        <Button onClick={() => fetchFlag()}>Test flag fetch</Button>
        <Button onClick={() => setFlag(true)}>Test flag put</Button>

        <Heading>Project List</Heading>

        {Array.isArray(projects) && projects?.length > 0 ? (
          <List
            data={projects.map((project) => ({
              key: project.id,
              label: `${project.name} (${project.shortName})`,
              description: `Led by: ${project.leader?.name || 'Unknown'}`,
              avatar: project.iconUrl,
            }))}
          />
        ) : (<Loader />)}

        <H2>Admin Panel Toggle</H2>
        <Toggle checked={isToggled} size={Size.Size20} onClick={() => setFlag(!isToggled)} /> {/*onTransitionEnd={() => setIsToggled(!isToggled)}*/}

      </ContentLayout>
    </div>
  );
};

export const App = memo(AppComponent);
