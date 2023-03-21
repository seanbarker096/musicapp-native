import { useQuery } from "react-query";
import { Performance, PerformancesStoreSlice } from "./performances.types";

type PerformanceObjectFields = keyof PerformancesStoreSlice['ObjectType'];


type PerformancesGetQueryField = Partial<{
    [key in PerformanceObjectFields]:
      | PerformancesStoreSlice['ObjectType'][key]
      | readonly PerformancesStoreSlice['ObjectType'][key][];
  }>;

export function usePerformancesGetQuery({}: PerformancesGetQueryField){



    return useQuery<readonly Performance[], unknown, readonly Performance[]>(){
        
    }
}