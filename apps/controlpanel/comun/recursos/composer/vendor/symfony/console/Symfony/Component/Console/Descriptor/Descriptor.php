<?php










namespace Symfony\Component\Console\Descriptor;

use Symfony\Component\Console\Application;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputDefinition;
use Symfony\Component\Console\Input\InputOption;


abstract class Descriptor implements DescriptorInterface
{
    public function describe($object, array $options = array())
    {
        switch (true) {
            case $object instanceof InputArgument:
                return $this->describeInputArgument($object, $options);
            case $object instanceof InputOption:
                return $this->describeInputOption($object, $options);
            case $object instanceof InputDefinition:
                return $this->describeInputDefinition($object, $options);
            case $object instanceof Command:
                return $this->describeCommand($object, $options);
            case $object instanceof Application:
                return $this->describeApplication($object, $options);
        }

        throw new \InvalidArgumentException(
            sprintf(
                'Object of type "%s" is not describable.',
                get_class($object)
            )
        );
    }


    abstract protected function describeInputArgument(
        InputArgument $argument,
        array $options = array()
    );


    abstract protected function describeInputOption(
        InputOption $option,
        array $options = array()
    );


    abstract protected function describeInputDefinition(
        InputDefinition $definition,
        array $options = array()
    );


    abstract protected function describeCommand(
        Command $command,
        array $options = array()
    );


    abstract protected function describeApplication(
        Application $application,
        array $options = array()
    );
}
