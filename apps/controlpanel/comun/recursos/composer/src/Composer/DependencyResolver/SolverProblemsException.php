<?php











namespace Composer\DependencyResolver;


class SolverProblemsException extends \RuntimeException
{
    protected $problems;
    protected $installedMap;

    public function __construct(array $problems, array $installedMap)
    {
        $this->problems = $problems;
        $this->installedMap = $installedMap;

        parent::__construct($this->createMessage(), 2);
    }

    protected function createMessage()
    {
        $text = "\n";
        foreach ($this->problems as $i => $problem) {
            $text .= "  Problema " . ($i + 1) . $problem->getPrettyString(
                    $this->installedMap
                ) . "\n";
        }

        if (strpos($text, 'could not be found')
            || strpos(
                $text,
                'no matching package found'
            )
            || strpos($text, 'no se encontraron coincidencias en los paquetes')
        ) {
            $text .= "\nPosibles causas:\n - El paquete no se encuentra disponible.";
        }

        return $text;
    }

    public function getProblems()
    {
        return $this->problems;
    }
}
