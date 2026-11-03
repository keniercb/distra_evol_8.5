<?php

class Util
{
    public static function toStrictBoolean(
        $_val, $_trueValues = array('yes', 'y', 'true', '1', 'on'),
        $_forceLowercase = true
    )
    {
        if (is_string($_val)) {
            return (in_array(
                ($_forceLowercase ? strtolower($_val) : $_val), $_trueValues
            )
            );
        } else {
            return (boolean)$_val;
        }
    }

    public static function spacify($camel, $glue = ' ')
    {
        return preg_replace('/([a-z0-9])([A-Z])/', "$1$glue$2", $camel);
    }

    public static function fullName($persona)
    {
        return implode(
            ' ',
            array($persona['nombre'], $persona['snombre'], $persona['papel'], $persona['sapel'])
        );
    }

    public static function object2Array($d)
    {
        if (is_object($d)) {
            $d = get_object_vars($d);
        }
        if (is_array($d)) {
            return array_map(array(__CLASS__, __METHOD__), $d);
        } else {
            return $d;
        }
    }

    public static function getCurrentDate()
    {
        return Zend_Date:: now();
        //return gmdate("Y-m-d H:i:s", $date->get);
    }

    public static function spanish_metaphone($string)
    {
        $normalizeChars = array(
            'Á'=>'A', 'À'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Å'=>'A', 'Ä'=>'A', 'Æ'=>'AE', 'Ç'=>'C',
            'É'=>'E', 'È'=>'E', 'Ê'=>'E', 'Ë'=>'E', 'Í'=>'I', 'Ì'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ð'=>'Eth',
            'Ñ'=>'N', 'Ó'=>'O', 'Ò'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O',
            'Ú'=>'U', 'Ù'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y',

            'á'=>'a', 'à'=>'a', 'â'=>'a', 'ã'=>'a', 'å'=>'a', 'ä'=>'a', 'æ'=>'ae', 'ç'=>'c',
            'é'=>'e', 'è'=>'e', 'ê'=>'e', 'ë'=>'e', 'í'=>'i', 'ì'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'eth',
            'ñ'=>'n', 'ó'=>'o', 'ò'=>'o', 'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o',
            'ú'=>'u', 'ù'=>'u', 'û'=>'u', 'ü'=>'u', 'ý'=>'y',

            'ß'=>'sz', 'þ'=>'thorn', 'ÿ'=>'y' ,
            'z'=>'S', 'b'=>'V'
        );
        //initialize metaphone key string
        $meta_key   = "";

        //set maximum metaphone key size
        $key_length   = 6;

        //set current position to the beginning
        $current_pos   =  0;

        //get string  length
        $string_length   = strlen($string);

        //set to  the end of the string
        $end_of_string_pos     = $string_length - 1;
        $original_string = $string. "    ";

        //Let's replace some spanish characters  easily confused
        $original_string = strtr($original_string,$normalizeChars);

        //convert string to uppercase
        $original_string = strtoupper($original_string);


        // main loop
        while (strlen($meta_key) < $key_length)
        {

            //break out of the loop if greater or equal than the length
            if ($current_pos >= $string_length)
            {
                break;
            }

            //get character from the string
            $current_char = substr($original_string, $current_pos, 1);

            //if it is a vowel, and it is at the begining of the string,
            //set it as part of the meta key
            if (self::is_vowel($original_string, $current_pos)
                && ($current_pos == 0))
            {
                $meta_key   .= $current_char;
                $current_pos += 1;
            }
            //Let's check for consonants  that have a single sound
            //or already have been replaced  because they share the same
            //sound like 'B' for 'V' and 'S' for 'Z'
            else if (self::string_at($original_string, $current_pos, 1,
                array('D','F','J','K','M','N','P','R','S','T','V')))
            {
                $meta_key   .= $current_char;

                //increment by two if a repeated letter is found
                if (substr($original_string, $current_pos + 1,1) == $current_char)
                {
                    $current_pos += 2;
                }

                //else increment only by one
                $current_pos += 1;
            }
            else  //check consonants with similar confusing sounds
            {

                switch ($current_char)
                {

                    case 'C':
                        //special case 'macho', chato,etc.
                        if (substr($original_string, $current_pos + 1,1)== 'H')
                        {
                            $current_pos += 2;
                        }
                        //special case 'acción', 'reacción',etc.
                        else if (substr($original_string, $current_pos + 1,1)== 'C')
                        {

                            $meta_key   .= 'X';
                            $current_pos += 2;
                            break;
                        }
                        // special case 'cesar', 'cien', 'cid', 'conciencia'
                        else if (self::string_at($original_string, $current_pos, 2,
                            array('CE','CI')))
                        {
                            $meta_key   .= 'S';
                            $current_pos += 2;
                            break;
                        }
                        // else
                        $meta_key   .= 'K';
                        $current_pos += 1;
                        break;

                    case 'G':
                        // special case 'gente', 'ecologia',etc
                        if (self::string_at($original_string, $current_pos, 2,
                            array('GE','GI')))
                        {
                            $meta_key   .= 'J';
                            $current_pos += 2;
                            break;
                        }
                        // else
                        $meta_key   .= 'G';
                        $current_pos += 1;
                        break;

                    //since the letter 'h' is silent in spanish,
                    //let's set the meta key to the vowel after the letter 'h'
                    case 'H':
                        if (self::is_vowel($original_string, $current_pos + 1))
                        {
                            $meta_key .= $original_string[$current_pos + 1];
                            $current_pos += 2;
                            break;
                        }

                        // else
                        $meta_key   .= 'H';
                        $current_pos += 1;
                        break;

                    case 'Q':
                        if (substr($original_string, $current_pos + 1,1) == 'U')
                        {
                            $current_pos += 2;
                        }
                        else
                        {
                            $current_pos += 1;
                        }

                        $meta_key   .= 'K';
                        break;

                    case 'W':
                        $meta_key   .= 'U';
                        $current_pos += 2;
                        break;

                    case 'X':
                        //some mexican spanish words like'Xochimilco','xochitl'
                        if ($current_pos == 0)
                        {
                            $meta_key   .= 'S';
                            $current_pos += 2;
                            break;
                        }

                        $meta_key   .= 'X';
                        $current_pos += 1;
                        break;

                    default:
                        $current_pos += 1;

                } // end of switch


            }//end else

        } // end of while loop


        //trim any blank characters
        $meta_key = trim($meta_key) ;

        //return the final meta key string
        return $meta_key;

    }

    private function string_at($string, $start, $string_length, $list)  {
        if (($start <0) || ($start >= strlen($string))) {
            return 0;
        }
        $subs = substr($string, $start, $string_length);
        for ($i=0; $i<count($list); $i++) {
            if ($list[$i] == $subs) {
                return 1;
            }
        }
        return 0;
    }

    private function is_vowel($string, $pos) {
        return ereg("[AEIOU]", substr($string, $pos, 1));
    }
}