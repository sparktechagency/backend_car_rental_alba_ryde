type getTotalUniqueCollaboratorsType = (collaborators: any) => number;

export const getTotalNumberOfUniqueCollaborators: getTotalUniqueCollaboratorsType =
  collaborators => {
    const uniqueCollaborators: any = [];
    for (let i = 0; i < collaborators.length; i++) {
      const currentCollaborator = collaborators[i];
      if (
        !uniqueCollaborators.some(
          (collab: any) =>
            collab.collaboratorId === currentCollaborator.collaboratorId
        )
      ) {
        uniqueCollaborators.push(currentCollaborator);
      }
    }
    return uniqueCollaborators.length;
  };
