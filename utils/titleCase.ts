
/**
 * Convert a word to title case
 * @param word - The word to convert to title case
 * @returns The input word in title case format
 */
function titleCase(word: string): string {
    return word.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  
export default titleCase;