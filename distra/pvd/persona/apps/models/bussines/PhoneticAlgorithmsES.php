<?php

/**
 * Class PhoneticAlgorithmsES
 */
class PhoneticAlgorithmsES
{
    public function metaphone($string)
    {
        //initialize metaphone key string
        $meta_key = "";
        //set maximum metaphone key size
        $key_length = 6;
        //set current position to the beginning
        $current_pos = 0;
        //get string  length
        $string_length = strlen($string);
        //set to  the end of the string
        $end_of_string_pos = $string_length - 1;
        $original_string = $string . "    ";
        //Let's replace some spanish characters  easily confused
        $original_string = self::str_tr(strtolower($original_string));
        //convert string to uppercase
        $original_string = strtoupper($original_string);
        // main loop
        while (strlen($meta_key) < $key_length) {
            //break out of the loop if greater or equal than the length
            if ($current_pos >= strlen($original_string)) {
                break;
            }
            //get character from the string
            $current_char = $original_string[$current_pos];
            //if it is a vowel, and it is at the begining of the string,
            //set it as part of the meta key
            if (self::is_vowel($original_string, $current_pos) && ($current_pos == 0)) {
                $meta_key .= $current_char;
                $current_pos += 1;
                //Let's check for consonants  that have a single sound
                //or already have been replaced  because they share the same
                //sound like 'B' for 'V' and 'S' for 'Z'
            } else {
                if (self::string_at(
                    $original_string, $current_pos, 1, ['D', 'F', 'J', 'K', 'M', 'N', 'P', 'T', 'V', 'L', 'Y']
                )
                ) {
                    $meta_key .= $current_char;
                    //increment by two if a repeated letter is found
                    print_r($current_pos);
                    print_r($current_char);
                    if (self::sub_str($original_string, $current_pos + 1, 1) === $current_char) {
                        $current_pos += 2;
                    } else { # increment only by one
                        $current_pos += 1;
                    }
                } else {//check consonants with similar confusing sounds
                    switch ($current_char) {
                        case 'C':
                            //special case 'macho', chato,etc.
                            //if (self.substr(original_string, current_pos + 1,1)== 'H'):
                            //$current_pos += 2
                            //special case 'acción', 'reacción',etc.
                            if (self::sub_str($original_string, $current_pos + 1, 1) == 'C') {
                                $meta_key .= 'X';
                                $current_pos += 2;
                            } elseif (self::string_at(
                                $original_string, $current_pos, 2, ['CE', 'CI']
                            )
                            ) {//special case 'cesar', 'cien', 'cid', 'conciencia'
                                $meta_key .= 'Z';
                                $current_pos += 2;
                            } else {
                                $meta_key .= 'K';
                                $current_pos += 1;
                            }
                            break;
                        case 'G':
                            //special case 'gente', 'ecologia',etc
                            if (self::string_at($original_string, $current_pos, 2, ['GE', 'GI'])) {
                                $meta_key .= 'J';
                                $current_pos += 2;
                            } else {
                                $meta_key .= 'G';
                                $current_pos += 1;
                            }
                            break;
                        //since the letter 'h' is silent in spanish,
                        //let's set the meta key to the vowel after the letter 'h'
                        case 'H':
                            if (self::is_vowel($original_string, $current_pos + 1)) {
                                //$meta_key .= $original_string[$current_pos + 1];
                                $current_pos += 2;
                            } else {
                                $meta_key .= 'H';
                                $current_pos += 1;
                            }
                            break;
                        case 'Q':
                            if (self::sub_str($original_string, $current_pos + 1, 1) == 'U') {
                                $current_pos += 2;
                            } else {
                                $current_pos += 1;
                                $meta_key .= 'K';
                            }
                            break;
                        case 'W':
                            /*if (current_pos == 0):
                            meta_key   += 'V'
                current_pos += 2*/
                            $meta_key .= 'U';
                            $current_pos += 1;
                            break;
                        //perro, arrebato, cara
                        case 'R':
                            $current_pos += 1;
                            $meta_key .= 'R';
                            break;
                        case 'S':
                            if ((!self::is_vowel($original_string, $current_pos + 1)) && ($current_pos == 0)) {
                                $meta_key .= 'ES';
                                $current_pos += 1;
                            } else {
                                $current_pos += 1;
                                $meta_key .= 'S';
                            }
                            break;
                        //zapato
                        case 'Z':
                            $current_pos += 1;
                            $meta_key .= 'Z';
                            break;
                        case 'X':
                            if ((!self::is_vowel($original_string, $current_pos + 1)) && strlen($string) > 1 &&
                                ($current_pos == 0)
                            ) {
                                $meta_key .= 'EX';
                                $current_pos += 1;
                            } else {
                                $meta_key .= 'X';
                                $current_pos += 1;
                            }
                            break;
                        default:
                            $current_pos += 1;
                            break;
                    }
                }
            }
        }
        //trim any blank characters
        $meta_key = trim($meta_key);

        //return the final meta key string
        return $meta_key;
    }

    static function str_tr($st)
    {
        if ($st) {
            $replace = array(
                'á' => 'A', 'ch' => 'X', 'ç' => 'S', 'é' => 'E', 'í' => 'I', 'ó' => 'O', 'ú' => 'U', 'ñ' => 'NY', 'gü' => 'W',
                'ü' => 'U', 'b' => 'V', 'z' => 'S', 'll' => 'Y');

            return strtr($st, $replace);
        }

        return '';
    }

    static function is_vowel($string, $pos)
    {
//        return $string[$pos] in ['A', 'E', 'I', 'O', 'U'];
        switch ($string[$pos]) {
            case 'A':
            case 'E':
            case 'I':
            case 'O':
            case 'U':
                return true;
        }

        return false;
    }

    static function string_at($string, $start, $string_length = 0, $lista)
    {
        if (($start < 0) or ($start >= strlen($string))) {
            return false;
        }
        $limit = $start + $string_length;
        $response = false;
        $string_tmp = str_replace(' ', '_', $string);
        foreach ($lista as $expr) {
            for ($i = $start; $i < $limit; $i++) {
                if ($string_tmp[$i] === $expr) {
                    return true;
                }
            }
        }

        return $response;
    }

    static function sub_str($string, $start, $string_length)
    {
        return isset($string[$start]) ? $string[$start] : false;
    }
}