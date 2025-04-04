import React, { memo, useCallback, useState, useEffect } from 'react';
import List from '@jetbrains/ring-ui-built/components/list/list';
import { HostAPI, Project } from '../../../@types/globals';
import Loader from '@jetbrains/ring-ui-built/components/loader/loader';
import ContentLayout from '@jetbrains/ring-ui-built/components/content-layout/content-layout';
import Toggle, { Size } from '@jetbrains/ring-ui-built/components/toggle/toggle';
import Heading, { H2 } from '@jetbrains/ring-ui-built/components/heading/heading';
import Button from '@jetbrains/ring-ui-built/components/Button/Button';
import { fetchProjects, fetchFlag, setFlag } from './api';

interface AppProps {
  host: HostAPI;
}

const AppComponent: React.FunctionComponent<AppProps> = ({ host }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const loadProjects = useCallback(async () => {
    const data = await fetchProjects(host);
    setProjects(data);
  }, [host]);

  const loadFlag = useCallback(async () => {
    const flagValue = await fetchFlag(host);
    setIsToggled(flagValue);
  }, [host]);

  const toggleFlag = async (newValue: boolean) => {
    const success = await setFlag(host, newValue);
    if (success) {
      setIsToggled(newValue);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    loadFlag();
  }, [loadFlag]);

  return (
    <div className="widget">
      <ContentLayout>
        <Heading>Project List</Heading>
        {projects.length > 0 ? (
          <List
            data={projects.map((project) => ({
              key: project.id,
              label: `${project.name} (${project.shortName})`,
              description: `Led by: ${project.leader?.name || 'Unknown'}`,
              avatar: project.iconUrl,
            }))}
          />
        ) : (
          <Loader />
        )}

        <H2>Admin Panel Toggle</H2>
        <Toggle checked={isToggled} size={Size.Size20} onClick={() => toggleFlag(!isToggled)} />
      </ContentLayout>
    </div>
  );
};

export const App = memo(AppComponent);
