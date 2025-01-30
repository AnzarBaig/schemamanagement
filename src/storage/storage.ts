export const SetBuildVersion = (data: any) => {
    localStorage.setItem('bv', JSON.stringify(data));
};

export const GetBuildVersion = (): any => {
    const data = localStorage.getItem('bv');
    return data ? JSON.parse(data) : null;
};
