<?php










namespace Symfony\Component\Console\Descriptor;


interface DescriptorInterface
{


    public function describe($object, array $options = array());
}
