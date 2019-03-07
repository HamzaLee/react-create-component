import Command from "./Command";
import Resolver from "./Resolver";
import ExtensionContext from './ExtensionContext';

class ComponentCreator {
  context:ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  create() {
    this.context.template.commands.forEach(this.executeCommand);
  }

  executeCommand = (cmd: Command) => {
    const resolver = new Resolver(this.context);
    const resolvedArgs = resolver.resolveArgs(cmd.args);
    const action = resolver.resolveAction(cmd.action);
    action.call(null, ...resolvedArgs);
  }
}

export default ComponentCreator;
