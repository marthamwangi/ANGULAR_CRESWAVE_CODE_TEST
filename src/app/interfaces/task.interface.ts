export interface ITask extends IDynamicProperty {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
}

export interface IResponse {
  success: true;
  message: string;
  data: any;
}

export interface IDynamicProperty {
  [indexKey: string]: any;
}
