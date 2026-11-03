<?php










namespace Symfony\Component\Console\Output;

use Symfony\Component\Console\Output\OutputInterface;


interface ConsoleOutputInterface extends OutputInterface
{


    public function getErrorOutput();


    public function setErrorOutput(OutputInterface $error);
}
