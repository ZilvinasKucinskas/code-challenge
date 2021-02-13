# frozen_string_literal: true

require 'nokogiri'
require 'json'

# -- Parameters

file_path = '../../files/van-gogh-paintings.html'

# -- Impelmentations

def get_doc_from_file(path)
  File.open(path) { |f| Nokogiri.HTML(f) }
end

def get_catalog_name(doc)
  # TODO: improve edge case handling
  selector = doc.css('.kxbc[jsaction="llc.sbc"]')
  selector[0]['data-elabel'].downcase
end

def get_extension(selector)
  ext = selector.css('.klmeta').children.text
  if ext.empty?
    # TODO: this will results `"extensions": null` in JSON file
    nil
  else
    [ext]
  end
end

# rubocop:disable Metrics/MethodLength:
def extract_data(doc)
  items_selector = doc.css('.klitem-tr .klitem[aria-label]')
  potential_count = items_selector.children.count
  items = []

  (0..potential_count - 1).each do |index|
    begin
      target_selector = items_selector[index]
      item = {
        name: target_selector['aria-label'],
        extensions: get_extension(target_selector),
        link: "https://www.google.com#{target_selector['href']}"
        # TODO: image property
      }
      items << item
    rescue StandardError
      # Do nothing
    end
  end

  items
end
# rubocop:enable Metrics/MethodLength:

# -- Execution

doc = get_doc_from_file file_path
catalog_name = get_catalog_name doc
items = extract_data doc
items_json_string = JSON.pretty_generate(items)

puts "\"#{catalog_name}\": " + items_json_string
