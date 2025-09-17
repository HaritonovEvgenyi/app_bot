import {useEffect} from "react";
import { useDispatch,  useSelector } from "react-redux";
import { fetchRepos } from "../features/githubSlice";
import type { RootState, AppDispatch } from "../app/store";

export default function ProjectList() {
    const dispatch = useDispatch<AppDispatch>();
    const { repos, loading } = useSelector((state: RootState) => state.github)

    useEffect(() => {
        dispatch(fetchRepos())
    }, [dispatch])

    if (loading) return <p>Загрузка...</p>;

    return (
        <ul>
            {repos.slice(0, 5).map((repo: any) => (
                <li key={repo.id}>
                    <a href={repo.html_url} target="_blank" style={{color: "red"}}>{repo.name}</a>
                </li>
            ))}
        </ul>
    )
}
