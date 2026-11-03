<?php










namespace Symfony\Component\Console\Helper;

use Symfony\Component\Console\Command\Command;


class HelperSet
{
    private $helpers;
    private $command;


    public function __construct(array $helpers = array())
    {
        $this->helpers = array();
        foreach ($helpers as $alias => $helper) {
            $this->set($helper, is_int($alias) ? null : $alias);
        }
    }


    public function set(HelperInterface $helper, $alias = null)
    {
        $this->helpers[$helper->getName()] = $helper;
        if (null !== $alias) {
            $this->helpers[$alias] = $helper;
        }

        $helper->setHelperSet($this);
    }


    public function has($name)
    {
        return isset($this->helpers[$name]);
    }


    public function get($name)
    {
        if (!$this->has($name)) {
            throw new \InvalidArgumentException(
                sprintf('The helper "%s" is not defined.', $name)
            );
        }

        return $this->helpers[$name];
    }


    public function setCommand(Command $command = null)
    {
        $this->command = $command;
    }


    public function getCommand()
    {
        return $this->command;
    }
}
